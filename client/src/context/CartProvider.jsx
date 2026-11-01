import { useEffect, useMemo, useState } from 'react';
import { CartContext } from './CartContext';

const CART_STORAGE_KEY = 'hermanos-jota-cart';

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(saved)) return [];

    return saved.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.nombre === 'string' &&
        Number.isFinite(item.precio) &&
        item.precio >= 0 &&
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0,
    );
  } catch {
    return [];
  }
}

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // El carrito sigue disponible durante la sesión si el storage está desactivado.
    }
  }, [cartItems]);

  const value = useMemo(() => {
    function addItem(producto, cantidad = 1) {
      if (
        !producto ||
        typeof producto.id !== 'string' ||
        typeof producto.nombre !== 'string' ||
        !Number.isFinite(producto.precio) ||
        producto.precio < 0 ||
        !Number.isInteger(cantidad) ||
        cantidad < 1
      ) {
        return;
      }

      setCartItems((actual) => {
        const existente = actual.find((item) => item.id === producto.id);
        const cantidadActual = existente?.cantidad ?? 0;
        const maximo = typeof producto.stock === 'number' ? producto.stock : Infinity;
        const nuevaCantidad = Math.min(maximo, cantidadActual + cantidad);

        if (nuevaCantidad <= cantidadActual) return actual;

        if (existente) {
          return actual.map((item) =>
            item.id === producto.id ? { ...item, cantidad: nuevaCantidad } : item,
          );
        }

        return [...actual, { ...producto, cantidad: nuevaCantidad }];
      });
    }

    function updateQuantity(id, cantidad) {
      if (!Number.isInteger(cantidad) || cantidad < 1) return;

      setCartItems((actual) =>
        actual.map((item) => {
          if (item.id !== id) return item;
          const maximo = typeof item.stock === 'number' ? item.stock : Infinity;
          return { ...item, cantidad: Math.min(cantidad, maximo) };
        }),
      );
    }

    function removeItem(id) {
      setCartItems((actual) => actual.filter((item) => item.id !== id));
    }

    function clearCart() {
      setCartItems([]);
    }

    return {
      items: cartItems,
      itemCount: cartItems.reduce((total, item) => total + item.cantidad, 0),
      subtotal: cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [cartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
