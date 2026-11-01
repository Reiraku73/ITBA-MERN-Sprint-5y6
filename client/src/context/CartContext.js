import { createContext } from 'react';

// Contexto del carrito. Se provee en <CartProvider> y se consume con useCart().
export const CartContext = createContext(null);
