import { Link } from 'react-router-dom';
import SafeImage from '../ui/SafeImage';
import { useCart } from '../../hooks/useCart';

function formatearPrecio(valor) {
  return '$' + valor.toLocaleString('es-AR');
}

function ProductCard({ producto }) {
  const { addItem } = useCart();

  // categoria e imagen son opcionales en el modelo: un producto cargado sin
  // ellos no tiene que romper el catálogo.
  const alt = producto.categoria
    ? `${producto.nombre}, ${producto.categoria.toLowerCase()}`
    : producto.nombre;

  return (
    <li>
      <article className="producto-card">
        <Link to={`/productos/${producto.id}`} className="producto-card__link">
          <figure className="producto-card__media">
            <SafeImage src={producto.imagen} alt={alt} width={600} height={600} loading="lazy" />
          </figure>
          <div className="producto-card__info">
            <p className="producto-card__categoria">{producto.categoria}</p>
            <h3>{producto.nombre}</h3>
            <p className="producto-card__price">{formatearPrecio(producto.precio)}</p>
          </div>
        </Link>
        <button
          type="button"
          className="btn btn--secondary producto-card__cta"
          onClick={() => addItem(producto)}
        >
          Agregar al carrito
        </button>
      </article>
    </li>
  );
}

export default ProductCard;
