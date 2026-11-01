import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard.jsx';
import { useProductos } from '../../hooks/useProductos';
const CANTIDAD_SKELETONS = 5;

function FeaturedProducts() {
  const { productos, cargando, error, reintentar } = useProductos();
  const destacados = productos.filter((producto) => producto.destacado);

  return (
    <section className="productos-destacados">
      <h2>Productos destacados</h2>

      <ul className="productos-destacados__grid" id="productos-destacados-grid">
        {cargando &&
          Array.from({ length: CANTIDAD_SKELETONS }).map((_, i) => (
            <li key={`skeleton-${i}`} className="skeleton-card" aria-hidden="true"></li>
          ))}

        {error && (
          <li className="estado-error">
            No pudimos cargar los productos destacados. Probá recargar la página.
          </li>
        )}

        {!cargando &&
          !error &&
          destacados.map((producto) => <ProductCard key={producto.id} producto={producto} />)}
      </ul>

      <Link to="/productos" className="btn btn--primary productos-destacados__ver-todo">
        Ver todos los productos
      </Link>
    </section>
  );
}

export default FeaturedProducts;
