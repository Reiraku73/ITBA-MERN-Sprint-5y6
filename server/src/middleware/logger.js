// Registra cada petición en UNA sola línea, con timestamp, al terminar de
// responder (así incluye el status y cuánto tardó):
//   [2026-11-01T18:00:00.000Z] GET /api/productos 200 12ms
export default function logger(req, res, next) {
  const inicio = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - inicio;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`,
    );
  });

  next();
}
