import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductoForm from '../../components/admin/ProductoForm.jsx';
import { getProductoById, actualizarProducto } from '../../services/productService.js';
import { getErrorMessage, isNotFound } from '../../services/api.js';

export default function EditarProducto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [noExiste, setNoExiste] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function cargar() {
      setCargando(true);
      setError('');
      setNoExiste(false);
      try {
        const data = await getProductoById(id, { signal: controller.signal });
        setProducto(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        if (isNotFound(err)) setNoExiste(true);
        else setError(getErrorMessage(err, 'No pudimos cargar el producto.'));
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    }

    cargar();
    return () => controller.abort();
  }, [id]);

  async function handleGuardar(datos) {
    await actualizarProducto(id, datos);
    navigate('/admin/productos');
  }

  return (
    <main>
      <section>
        <Link to="/admin/productos" className="admin-volver">
          <span aria-hidden="true">←</span> Volver al listado
        </Link>
        <h1>Editar producto</h1>

        {cargando && <p>Cargando producto…</p>}

        {noExiste && (
          <>
            <p>No encontramos un producto con ese ID.</p>
            <Link to="/admin/productos" className="btn btn--primary">
              Volver al listado
            </Link>
          </>
        )}

        {error && (
          <p className="admin-form__error-servidor" role="alert">
            {error}
          </p>
        )}

        {producto && (
          <ProductoForm
            valoresIniciales={producto}
            onSubmit={handleGuardar}
            textoBoton="Guardar cambios"
          />
        )}
      </section>
    </main>
  );
}