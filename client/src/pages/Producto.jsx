import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductoById } from '../services/productService';
import { isNotFound } from '../services/api';
import { useApiQuery } from '../hooks/useApiQuery';
import Loading from '../components/ui/Loading';
import Alert from '../components/ui/Alert';
import ProductDetail from '../components/products/ProductDetail';

// Ficha de producto: /productos/:id
export default function Producto() {
  const { id = '' } = useParams();
  const {
    data: producto,
    loading,
    error,
    reload,
  } = useApiQuery((signal) => getProductoById(id, { signal }), [id]);

  useEffect(() => {
    document.title = producto ? `${producto.nombre} | Hermanos Jota` : 'Producto | Hermanos Jota';
  }, [producto]);

  // Al pasar de un producto a otro (desde un carrusel) se vuelve arriba.
  useEffect(() => {
    window.scrollTo?.(0, 0);
  }, [id]);

  // Renderizado condicional: cargando → no existe → error → ficha.
  // "No existe" y "no pudimos cargarlo" son cosas distintas: en el segundo
  // caso tiene sentido reintentar, en el primero no.
  let contenido;
  if (loading) {
    contenido = <Loading>Cargando producto...</Loading>;
  } else if (error != null && isNotFound(error)) {
    contenido = (
      <div className="state-message">
        <p role="alert">
          No encontramos ese producto. Puede que el enlace esté roto o que ya no esté disponible.
        </p>
        <Link to="/productos">Volver al catálogo</Link>
      </div>
    );
  } else if (error != null || !producto) {
    contenido = (
      <div>
        <Alert title="No pudimos cargar el producto" error={error} onRetry={reload} />
        <Link to="/productos">Volver al catálogo</Link>
      </div>
    );
  } else {
    // key: al pasar de un producto a otro se reinicia todo (cantidad, galería).
    contenido = <ProductDetail key={producto.id} producto={producto} />;
  }

  return (
    <main>
      <div className="pdp">
        <div className="pdp__inner">{contenido}</div>
      </div>
    </main>
  );
}
