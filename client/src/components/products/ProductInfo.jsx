import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import QuantitySelector from './QuantitySelector';
import { useCart } from '../../hooks/useCart';
import { CartIcon, CheckIcon, ChevronIcon, LockIcon } from '../ui/Icons';
import { announce } from '../../utils/announce';
import { formatCurrency } from '../../utils/formatCurrency';

/**
 * Columna derecha de la ficha: título, precio, stock, cantidad y compra.
 *
 *  - El carrito se toma del contexto (useCart), no por props.
 *  - onShowPayments: abre el modal de medios de pago.
 *
 * `producto.stock` es opcional: si el producto no lo trae, se asume que hay
 * disponibilidad y no se muestra el tope ni el "N disponibles".
 */
export default function ProductInfo({ producto, onShowPayments }) {
  const { addItem } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const navigate = useNavigate();

  const tieneStock = typeof producto.stock === 'number';
  const sinStock = tieneStock && producto.stock === 0;

  function handleAgregar() {
    if (sinStock) return;
    addItem(producto, cantidad);
    announce(`${producto.nombre} agregado al carrito`);
    setAgregado(true);
  }

  // "Comprar ahora": suma al carrito y va directo al carrito.
  function handleComprarAhora() {
    if (sinStock) return;
    addItem(producto, cantidad);
    navigate('/carrito');
  }

  return (
    <div className="buybox">
      <p className="buybox__eyebrow">Hermanos Jota · Colección {producto.categoria}</p>
      <h1 className="buybox__title">{producto.nombre}</h1>

      <div className="buybox__price-block">
        <p className="buybox__price-row">
          <span className="buybox__price">{formatCurrency(producto.precio)}</span>
        </p>
        <button type="button" className="buybox__payments-link" onClick={onShowPayments}>
          Ver todos los medios de pago <ChevronIcon />
        </button>
      </div>

      {sinStock ? (
        <p className="buybox__stock buybox__stock--out">Sin stock</p>
      ) : (
        <p className="buybox__stock">
          <CheckIcon /> Disponible en stock
        </p>
      )}

      {!sinStock && (
        <div className="buybox__quantity">
          <span>Cantidad</span>
          <QuantitySelector
            value={cantidad}
            onChange={(siguiente) => {
              setCantidad(siguiente);
              setAgregado(false);
            }}
            max={tieneStock ? producto.stock : undefined}
          />
          {tieneStock && <span className="buybox__available">{producto.stock} disponibles</span>}
        </div>
      )}

      <div className="buybox__actions">
        <button
          type="button"
          className="buybox__btn buybox__btn--primary"
          onClick={handleComprarAhora}
          disabled={sinStock}
        >
          Comprar ahora <ChevronIcon />
        </button>
        <button
          type="button"
          className="buybox__btn buybox__btn--secondary"
          onClick={handleAgregar}
          disabled={sinStock}
        >
          {sinStock ? (
            'Sin stock'
          ) : (
            <>
              <CartIcon /> Agregar al carrito
            </>
          )}
        </button>
      </div>

      {agregado && (
        <p className="buybox__added" role="status">
          Agregado al carrito. <Link to="/carrito">Ver carrito</Link>
        </p>
      )}

      <p className="buybox__secure">
        <LockIcon /> Compra segura y protegida
      </p>
    </div>
  );
}
