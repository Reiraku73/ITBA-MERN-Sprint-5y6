import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import CrearProducto from './pages/admin/CrearProducto.jsx';
import ProductosAdmin from './pages/admin/ProductosAdmin.jsx';
import EditarProducto from './pages/admin/EditarProducto.jsx';

import { useAuth } from './hooks/useAuth.js';

import { Home } from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Productos from './pages/Productos.jsx';
import Producto from './pages/Producto.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Registro.jsx';
import Cuenta from './pages/Cuenta.jsx';
import Contacto from './pages/Contacto.jsx';
import Carrito from './pages/Carrito.jsx';

import Terminos from './pages/Terminos.jsx';
import Privacidad from './pages/Privacidad.jsx';
import CambiosDevoluciones from './pages/CambiosDevoluciones.jsx';

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

function AppRoutes({ cart }) {
  const { pathname } = useLocation();
  const { usuario, registrarUsuario, iniciarSesion, cerrarSesion, actualizarUsuario } = useAuth();

  return (
    <ErrorBoundary key={pathname}>
      <Routes>
        <Route path="/" element={<Home onAgregar={cart.addItem} />} />
        <Route path="/productos" element={<Productos onAgregar={cart.addItem} />} />
        <Route path="/productos/:id" element={<Producto onAgregar={cart.addItem} />} />
        <Route
          path="/carrito"
          element={
            <Carrito
              items={cart.items}
              itemCount={cart.itemCount}
              subtotal={cart.subtotal}
              onQuantityChange={cart.updateQuantity}
              onRemove={cart.removeItem}
              onClear={cart.clearCart}
            />
          }
        />

        <Route path="/contacto" element={<Contacto />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/cambios-devoluciones" element={<CambiosDevoluciones />} />

        <Route path="/admin/crear-producto" element={<CrearProducto />} />
        <Route path="/admin/productos" element={<ProductosAdmin />} />
        <Route path="/admin/editar-producto/:id" element={<EditarProducto />} />

        <Route path="/login" element={usuario ? <Navigate to="/cuenta" replace /> : <Login onLogin={iniciarSesion} />} />
        <Route path="/register" element={usuario ? <Navigate to="/cuenta" replace /> : <Register onRegistrar={registrarUsuario} />} />
        <Route path="/cuenta" element={usuario ? <Cuenta usuario={usuario} onActualizar={actualizarUsuario} onLogout={cerrarSesion} /> : <Navigate to="/login" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  const [cartItems, setCartItems] = useState(readCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // El carrito sigue disponible durante la sesión si el storage está desactivado.
    }
  }, [cartItems]);

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

  const cart = {
    items: cartItems,
    itemCount: cartItems.reduce((total, item) => total + item.cantidad, 0),
    subtotal: cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header cantidadCarrito={cart.itemCount} />
      <div id="live-region" className="visually-hidden" role="status" aria-live="polite" />
      <AppRoutes cart={cart} />
      <Footer />
    </BrowserRouter>
  );
}

export default App;