// Manejador de errores centralizado. Se registra al FINAL de app.js (después
// de notFound). Express lo reconoce por tener 4 parámetros.
//
// Responde siempre con el mismo formato que usa el controlador:
//   { data: null, error: { message, code } }

// Para lanzar un error con status propio desde un controlador:
//   throw new ApiError(400, 'Falta el campo nombre')
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

const CODE_BY_STATUS = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  413: 'PAYLOAD_TOO_LARGE',
  422: 'VALIDATION_ERROR',
};

export default function errorHandler(err, req, res, next) {
  // Si ya se empezó a responder, Express tiene que cerrar la conexión.
  if (res.headersSent) return next(err);

  let status = Number(err.statusCode ?? err.status);
  if (!Number.isInteger(status) || status < 400 || status > 599) status = 500;
  let message = err.message;

  // Errores de express.json() ANTES de llegar a un controlador: un cuerpo
  // que no es JSON válido, o uno demasiado grande. Traen `type`, pero no
  // son ApiError: sin este caso el mensaje saldría en inglés.
  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'El cuerpo de la petición no es un JSON válido.';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'El contenido enviado es demasiado grande.';
  } else if (err.name === 'ValidationError') {
    // Error de validación del esquema de Mongoose (campo requerido, mínimo, etc.)
    status = 422;
    message = Object.values(err.errors).map((e) => e.message).join(' ');
  } else if (err.name === 'CastError') {
    // Valor con tipo inválido: un ID mal formado o un precio no numérico
    status = 400;
    message = err.path === '_id'
      ? 'El ID indicado no es válido.'
      : `El valor de "${err.path}" no es válido.`;
  }

  // Los errores del servidor se registran (con método y URL para poder
  // rastrearlos), pero no se le muestra el detalle interno a quien hace la
  // petición.
  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
    message = 'Error interno del servidor.';
  }

  res.status(status).json({
    data: null,
    error: { message, code: CODE_BY_STATUS[status] ?? (status >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST') },
  });
}
