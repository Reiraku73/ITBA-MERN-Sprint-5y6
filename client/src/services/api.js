// Cliente HTTP único del frontend. Todos los *Service.js pasan por acá, así
// el timeout, el parseo de la respuesta y la traducción de errores viven en
// un solo lugar y el resto del código solo recibe datos o un HttpError ya
// listo para mostrarle un mensaje a la persona.

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api').replace(/\/+$/, '');
const DEFAULT_TIMEOUT_MS = 15000;

// kind: 'network' (sin conexión / servidor caído), 'timeout',
// 'invalid-response' (un 2xx que no era JSON) o 'http' (el servidor
// respondió con un error).
export class HttpError extends Error {
  constructor(kind, status, message, extra = {}) {
    super(message);
    this.name = 'HttpError';
    this.kind = kind;
    this.status = status; // 0 si nunca hubo respuesta (red caída, timeout)
    this.code = extra.code; // código estable de la API (ej. "NOT_FOUND")
    this.details = extra.details;
  }

  // Tiene sentido ofrecer "Reintentar": fallas que pueden ser pasajeras.
  get retryable() {
    return this.kind === 'network' || this.kind === 'timeout' || this.status >= 500;
  }
}

// Si el error no vino de esta capa (un bug propio, un TypeError crudo) NO
// se muestra su mensaje técnico: se usa el texto de reemplazo.
export function getErrorMessage(err, fallback = 'Algo salió mal. Probá de nuevo.') {
  return err instanceof HttpError ? err.message : fallback;
}

export function isNotFound(err) {
  return err instanceof HttpError && err.status === 404;
}

// Marca para "el body no era JSON" (distinta de undefined = "no había body").
const UNPARSEABLE = Symbol('unparseable');

async function readBody(res) {
  // Se lee como texto y se parsea a mano: res.json() tira ante un body
  // vacío (204) o ante una página de error en HTML de un proxy; así cada
  // caso se resuelve explícitamente.
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return UNPARSEABLE;
  }
}

// La API de este proyecto responde los errores como
// { data: null, error: { message, code } }; también se entiende la forma
// plana { message, code, details } por si el backend cambia.
function httpErrorFromResponse(res, body) {
  const raw = body && typeof body === 'object' ? body : {};
  const data = raw.error && typeof raw.error === 'object' ? raw.error : raw;
  const serverMessage = typeof data.message === 'string' ? data.message : undefined;
  const code = typeof data.code === 'string' ? data.code : undefined;
  const details = Array.isArray(data.details)
    ? data.details.filter((d) => typeof d === 'string')
    : undefined;

  if (res.status >= 500) {
    // Nunca se muestra lo que diga el server en un 5xx: puede ser un
    // mensaje interno. El detalle real queda en los logs del backend.
    return new HttpError(
      'http',
      res.status,
      'Tuvimos un problema de nuestro lado. Probá de nuevo en unos minutos.',
      { code },
    );
  }
  if (res.status === 403) {
    return new HttpError('http', 403, serverMessage ?? 'No tenés permisos para hacer esto.', {
      code,
    });
  }
  if (res.status === 429) {
    return new HttpError(
      'http',
      429,
      'Hiciste demasiados intentos. Esperá un momento y probá de nuevo.',
      { code },
    );
  }
  const detailText = details && details.length > 0 ? `: ${details.join(', ')}` : '';
  return new HttpError(
    'http',
    res.status,
    (serverMessage ?? `No se pudo completar la acción (error ${res.status}).`) + detailText,
    {
      code,
      details,
    },
  );
}

// Todos los endpoints responden envueltos como { data, error }. Esta función
// devuelve solo `data`; si algún día llegara un array "pelado", lo deja pasar.
function unwrap(body) {
  const esEnvoltorio =
    body !== null &&
    typeof body === 'object' &&
    !Array.isArray(body) &&
    'data' in body &&
    'error' in body;
  return esEnvoltorio ? body.data : body;
}

export async function apiFetch(
  path,
  { method = 'GET', body, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = {},
) {
  // Un solo AbortController para dos orígenes de cancelación: el timeout
  // propio y la señal de quien llama (ej. un componente que se desmonta).
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onCallerAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onCallerAbort, { once: true });
  }

  try {
    let res;
    try {
      res = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
          Accept: 'application/json',
          ...(body !== undefined && { 'Content-Type': 'application/json' }),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (err) {
      if (timedOut) {
        throw new HttpError(
          'timeout',
          0,
          'El servidor tardó demasiado en responder. Probá de nuevo.',
        );
      }
      // Cancelado a propósito por quien llamó: no es un error para mostrar.
      if (signal?.aborted) throw err;
      throw new HttpError(
        'network',
        0,
        'No pudimos conectarnos con el servidor. Revisá tu conexión y probá de nuevo.',
      );
    }

    let payload;
    try {
      payload = await readBody(res);
    } catch (err) {
      if (signal?.aborted) throw err;
      // La conexión se cortó o venció el timeout mientras llegaba el cuerpo.
      throw timedOut
        ? new HttpError('timeout', 0, 'El servidor tardó demasiado en responder. Probá de nuevo.')
        : new HttpError('network', 0, 'Se cortó la conexión con el servidor. Probá de nuevo.');
    }

    if (!res.ok) {
      throw httpErrorFromResponse(res, payload === UNPARSEABLE ? undefined : payload);
    }
    if (payload === UNPARSEABLE) {
      // Un 2xx con algo que no es JSON (ej. el HTML de un proxy o una URL
      // de API mal configurada) no se puede usar como dato.
      throw new HttpError(
        'invalid-response',
        res.status,
        'Recibimos una respuesta inesperada del servidor.',
      );
    }
    // 204 o cuerpo vacío: no hay datos, y eso es válido.
    return unwrap(payload);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onCallerAbort);
  }
}

export const http = {
  get: (path, options) => apiFetch(path, { ...options, method: 'GET' }),
  post: (path, body, options) => apiFetch(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => apiFetch(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => apiFetch(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => apiFetch(path, { ...options, method: 'DELETE' }),
};
