import { useState } from 'react';
import { getProductos } from '../../services/productService';
import { useApiQuery } from '../../hooks/useApiQuery';
import { buildRelated } from '../../utils/related';
import Breadcrumb from './Breadcrumb';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import TrustStrip from './TrustStrip';
import ProductCarousel from './ProductCarousel';
import PaymentMethods from './PaymentMethods';
import PaymentMethodsModal from './PaymentMethodsModal';
import ProductSpecs from './ProductSpecs';
import ProductDescription from './ProductDescription';

// Ficha completa de un producto ya cargado (la página Producto se ocupa de
// pedirlo y de los estados de carga / error).
export default function ProductDetail({ producto }) {
  const [pagosAbierto, setPagosAbierto] = useState(false);

  // Los carruseles son un complemento: si el catálogo no carga, simplemente
  // no se muestran (la ficha del producto en sí ya está completa y usable).
  const { data: catalogo } = useApiQuery((signal) => getProductos({ signal }), []);
  const relacionados = buildRelated(producto, catalogo ?? []);

  return (
    <>
      <Breadcrumb producto={producto} />

      <article className="pdp__top">
        <div className="pdp__media">
          <ProductGallery producto={producto} />
        </div>
        <ProductInfo producto={producto} onShowPayments={() => setPagosAbierto(true)} />
      </article>

      <TrustStrip />

      <ProductCarousel title="También te puede gustar" productos={relacionados.alsoLike} />
      <PaymentMethods />
      <ProductSpecs specs={producto.specs} />
      <ProductDescription descripcion={producto.descripcion} />
      <ProductCarousel title="Completá tu espacio" productos={relacionados.complete} />

      {pagosAbierto && <PaymentMethodsModal onClose={() => setPagosAbierto(false)} />}
    </>
  );
}
