import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

// Acceso al carrito desde cualquier componente, sin pasar props:
//   const { items, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart } = useCart();
export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error('useCart tiene que usarse dentro de <CartProvider>.');
  return cart;
}
