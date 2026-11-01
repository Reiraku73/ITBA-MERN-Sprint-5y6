import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductos, eliminarProducto } from '../../services/productService.js';
import { getErrorMessage } from '../../services/api.js';

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [confirmandoId, setConfirmandoId] = useState(null);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [errorEliminar, setErrorEliminar] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function cargar() {
      try {
        const data = await getProductos({ signal: controller.signal });
        setProductos(Array.isArray(data) ? data : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        setErrorCarga(getErrorMessage(err, 'No pudimos cargar los productos.'));
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    }

    cargar();
    return () => controller.abort();
  }, []);

  const termino = busqueda.trim().toLowerCase();
  const visibles = termino
    ? productos.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(termino) ||
        p.categoria?.toLowerCase().includes(termino),
    )
    : productos;

  async function handleEliminar(producto) {
    setErrorEliminar('');
    setMensaje('');
    setEliminandoId(producto.id);
    try {
      await eliminarProducto(producto.id);
      setProductos((actual) => actual.filter((p) => p.id !== producto.id));
      setMensaje(`Se eliminó "${producto.nombre}".`);
      setConfirmandoId(null);
    } catch (err) {
      setErrorEliminar(getErrorMessage(err, 'No pudimos eliminar el producto. Probá de nuevo.'));
    } finally {
      setEliminandoId(null);
    }
  }

  return (
    <main>
      <section className="admin-listado">
        <Link to="/" className="admin-volver">
          <span aria-hidden="true">←</span> Volver al inicio
        </Link>
        <div className="admin-listado__encabezado">
          <h1>Administrar productos</h1>
          <Link to="/admin/crear-producto" className="btn btn--primary">
            Crear producto
          </Link>
        </div>

        <div className="admin-listado__buscador">
          <label htmlFor="buscar-admin" className="visually-hidden">
            Buscar productos
          </label>
          <input
            id="buscar-admin"
            type="search"
            placeholder="Buscar por nombre o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {mensaje && (
          <p className="admin-listado__mensaje" role="status">
            {mensaje}
          </p>
        )}
        {errorEliminar && (
          <p className="admin-form__error-servidor" role="alert">
            {errorEliminar}
          </p>
        )}

        {cargando && <p>Cargando productos…</p>}
        {errorCarga && (
          <p className="admin-form__error-servidor" role="alert">
            {errorCarga}
          </p>
        )}

        {!cargando && !errorCarga && visibles.length === 0 && (
          <p>{termino ? 'No hay productos que coincidan con la búsqueda.' : 'Todavía no hay productos.'}</p>
        )}

        {visibles.length > 0 && (
          <ul className="admin-listado__lista">
            {visibles.map((p) => (
              <li key={p.id} className="admin-listado__item">
                <div className="admin-listado__info">
                  <strong>{p.nombre}</strong>
                  <span>
                    {p.categoria} · ${Number(p.precio).toLocaleString('es-AR')}
                  </span>
                </div>

                <div className="admin-listado__acciones">
                  {confirmandoId === p.id ? (
                    <>
                      <span>¿Eliminar este producto?</span>
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => handleEliminar(p)}
                        disabled={eliminandoId === p.id}
                      >
                        {eliminandoId === p.id ? 'Eliminando…' : 'Sí, eliminar'}
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => setConfirmandoId(null)}
                        disabled={eliminandoId === p.id}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to={`/admin/editar-producto/${encodeURIComponent(p.id)}`}
                        className="btn btn--secondary"
                        aria-label={`Editar ${p.nombre}`}
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={() => {
                          setErrorEliminar('');
                          setMensaje('');
                          setConfirmandoId(p.id);
                        }}
                        aria-label={`Eliminar ${p.nombre}`}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}