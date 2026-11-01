import { getOpiniones } from '../services/opinionService';
import { getErrorMessage } from '../services/api';
import { useApiQuery } from './useApiQuery';

// Mismo patrón que useProductos: pasa por el cliente HTTP único
// (services/api.js), así la URL base, el timeout y los errores salen de un
// solo lugar. Devuelve `error` como texto listo para mostrar.
export function useOpinions() {
  const { data, loading, error, reload } = useApiQuery((signal) => getOpiniones({ signal }), []);
  return {
    opiniones: data ?? [],
    cargando: loading,
    error: error ? getErrorMessage(error) : null,
    reintentar: reload,
  };
}
