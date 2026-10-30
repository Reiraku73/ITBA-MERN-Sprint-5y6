import { http } from './api';

// GET /api/productos → array con todos los productos.
export function getProductos(options) {
  return http.get('/productos', options);
}

// GET /api/productos/:id → un producto, o HttpError 404 si no existe.
// encodeURIComponent: un id con caracteres raros ("a/b", "a?b") no puede
// alterar la ruta.
export function getProductoById(id, options) {
  return http.get(`/productos/${encodeURIComponent(id)}`, options);
}

// POST /api/productos → crea un producto.
export function createProducto(producto, options) {
  return http.post('/productos', producto, options);
}

// PUT /api/productos/:id → reemplaza los datos de un producto.
export function updateProducto(id, producto, options) {
  return http.put(`/productos/${encodeURIComponent(id)}`, producto, options);
}

// DELETE /api/productos/:id → elimina un producto.
export function deleteProducto(id, options) {
  return http.delete(`/productos/${encodeURIComponent(id)}`, options);
}