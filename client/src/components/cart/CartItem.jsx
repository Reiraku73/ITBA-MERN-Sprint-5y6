import { Link } from 'react-router-dom';
import QuantitySelector from '../products/QuantitySelector';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <li className="cart-item">
      <Link className="cart-item__image-link" to={`/productos/${item.id}`}>
        <img className="cart-item__image" src={item.imagen} alt="" loading="lazy" />
      </Link>

      <div className="cart-item__details">
        <p className="cart-item__category">{item.categoria}</p>
        <h2 className="cart-item__name">
          <Link to={`/productos/${item.id}`}>{item.nombre}</Link>
        </h2>
        <p className="cart-item__unit-price">{formatCurrency(item.precio)} c/u</p>
        <div className="cart-item__controls">
          <QuantitySelector
            value={item.cantidad}
            onChange={(cantidad) => onQuantityChange(item.id, cantidad)}
            max={typeof item.stock === 'number' ? item.stock : undefined}
            itemLabel={item.nombre}
          />
          <button
            className="cart-item__remove"
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Quitar ${item.nombre} del carrito`}
          >
            Quitar
          </button>
        </div>
      </div>

      <p className="cart-item__total">{formatCurrency(item.precio * item.cantidad)}</p>
    </li>
  );
}
