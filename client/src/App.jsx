import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import CartProvider from './context/CartProvider.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import CrearProducto from './pages/admin/CrearProducto.jsx';
import ProductosAdmin from './pages/admin/ProductosAdmin.jsx';
import EditarProducto from './pages/admin/EditarProducto.jsx';

import { useAuth } from './hooks/useAuth.js';

import Home from './pages/Home.jsx';
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

function AppRoutes() {
  const { pathname } = useLocation();
  const { usuario, registrarUsuario, iniciarSesion, cerrarSesion, actualizarUsuario } = useAuth();

  return (
    <ErrorBoundary key={pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<Producto />} />
        <Route path="/carrito" element={<Carrito />} />

        <Route path="/contacto" element={<Contacto />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/cambios-devoluciones" element={<CambiosDevoluciones />} />

        <Route path="/admin/crear-producto" element={<CrearProducto />} />
        <Route path="/admin/productos" element={<ProductosAdmin />} />
        <Route path="/admin/editar-producto/:id" element={<EditarProducto />} />

        <Route
          path="/login"
          element={usuario ? <Navigate to="/cuenta" replace /> : <Login onLogin={iniciarSesion} />}
        />
        <Route
          path="/register"
          element={
            usuario ? (
              <Navigate to="/cuenta" replace />
            ) : (
              <Register onRegistrar={registrarUsuario} />
            )
          }
        />
        <Route
          path="/cuenta"
          element={
            usuario ? (
              <Cuenta usuario={usuario} onActualizar={actualizarUsuario} onLogout={cerrarSesion} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <div id="live-region" className="visually-hidden" role="status" aria-live="polite" />
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}
