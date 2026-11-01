import { opiniones } from '../data/opiniones.js';

// GET /api/opiniones
// Mismo formato de respuesta que /api/productos: { data, error }.
export const getOpiniones = (req, res) => {
  res.status(200).json({ data: opiniones, error: null });
};
