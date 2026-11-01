import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function MobileMenu({ isOpen, onClose }) {
  return (
    <>
      <nav className="header__nav">
        <ul id="primary-menu" className={isOpen ? 'nav__list is-open' : 'nav__list'}>
          <li>
            <NavLink onClick={onClose} to="/">
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink onClick={onClose} to="/productos">
              Productos
            </NavLink>
          </li>
          <li>
            <Link onClick={onClose} to="/#historia">
              Nosotros
            </Link>
          </li>
          <li>
            <NavLink onClick={onClose} to="/contacto">
              Contacto
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
