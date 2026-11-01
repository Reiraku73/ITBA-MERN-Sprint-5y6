import { getProductos, getProductoById } from '../services/productService';
import { getErrorMessage } from '../services/api';
import { useApiQuery } from './useApiQuery';

// Hooks de conveniencia sobre useApiQuery: pasan por el cliente HTTP único
// (services/api.js), así la URL base, el timeout y los mensajes de error
// salen de un solo lugar. Devuelven `error` como texto listo para mostrar.

// Todos los productos.
export function useProductos() {
  const { data, loading, error, reload } = useApiQuery((signal) => getProductos({ signal }), []);
  return {
    productos: data ?? [],
    cargando: loading,
    error: error ? getErrorMessage(error) : null,
    reintentar: reload,
  };
}

// Un solo producto.
export function useProducto(id) {
  const { data, loading, error, reload } = useApiQuery(
    (signal) => getProductoById(id, { signal }),
    [id],
  );
  return {
    producto: data,
    cargando: loading,
    error: error ? getErrorMessage(error) : null,
    reintentar: reload,
  };
}
