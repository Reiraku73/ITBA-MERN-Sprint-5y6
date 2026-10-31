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

// POST /api/productos → crea un producto y devuelve el producto creado (201).
// `datos` tiene que venir con los tipos correctos (precio/stock numéricos,
// destacado booleano).
export function crearProducto(datos, options) {
  return http.post('/productos', datos, options);
}

// PUT /api/productos/:id → actualiza un producto existente y devuelve el
// producto actualizado. HttpError 404 si no existe.
export function actualizarProducto(id, cambios, options) {
  return http.put(`/productos/${encodeURIComponent(id)}`, cambios, options);
}

// DELETE /api/productos/:id → elimina un producto y devuelve el producto
// borrado. HttpError 404 si no existe.
export function eliminarProducto(id, options) {
  return http.delete(`/productos/${encodeURIComponent(id)}`, options);
}
