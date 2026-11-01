import { http } from './api';

// GET /api/opiniones → array con las opiniones de clientes.
export function getOpiniones(options) {
  return http.get('/opiniones', options);
}
