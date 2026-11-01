import express from 'express';
import cors from 'cors';
import logger from './middleware/logger.js';
import router from './routes/products.js';
import opinionesRouter from './routes/opinions.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// CORS: solo se aceptan los orígenes listados en CORS_ORIGIN (separados por
// coma), p. ej. "http://localhost:5173,https://mi-app.vercel.app".
// Sin la variable, en desarrollo se acepta cualquier origen.
const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);
app.use(logger);

// Límite explícito para el cuerpo de las peticiones
app.use(express.json({ limit: '100kb' }));

// Chequeo de salud (útil para probar el despliegue y para Render)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Rutas de la API
app.use('/api/productos', router);
app.use('/api/opiniones', opinionesRouter);

// Manejo de errores y rutas no encontradas (siempre al final)
app.use(notFound);
app.use(errorHandler);

export default app;
