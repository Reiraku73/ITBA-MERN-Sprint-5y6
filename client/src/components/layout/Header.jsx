import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import MobileMenu from './MobileMenu';

export default function Header({ cantidadCarrito = 0 }) {
  const [state, setState] = useState(false);

  function handleNavigate() {
    setState(false);
  }

  return (
    <header className="site-header">
      <div className="header__logo">
        <NavLink to="/" className="header__logo-link">
          <img
            src="/images/branding/isotipo.png"
            alt=""
            width="34"
            height="41"
          />
          <span className="header__wordmark">Hermanos Jota</span>
        </NavLink>
      </div>

      <MobileMenu isOpen={state} onClose={handleNavigate} />

      <div className="header__actions">
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={state}
          aria-controls="primary-menu"
          aria-label="Abrir menú de navegación"
          onClick={() => setState((prev) => !prev)}
        >
          <span aria-hidden="true">☰</span>
        </button>

        <NavLink to="/cuenta" className="header__icon-link">
          <img src="/icons/user.svg" alt="" width="24" height="24" />
        </NavLink>

        <NavLink to="/carrito" className="header__icon-link header__cart">
          <img src="/icons/cart.svg" alt="" width="24" height="24" />
          <span className="cart-count" aria-label={`${cantidadCarrito} productos en el carrito`}>
            {cantidadCarrito}
          </span>
        </NavLink>
      </div>
    </header>
  );
}