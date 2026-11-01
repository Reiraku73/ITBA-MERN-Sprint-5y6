import { Link } from 'react-router-dom';

// Links de navegación principal (mismas rutas que usa MobileMenu)
const LINKS_NAVEGACION = [
  { texto: 'Inicio', ruta: '/' },
  { texto: 'Productos', ruta: '/productos' },
  { texto: 'Nosotros', ruta: '/#historia' },
  { texto: 'Contacto', ruta: '/contacto' },
];

// Links a las páginas de información legal
const LINKS_LEGALES = [
  { texto: 'Términos y condiciones', ruta: '/terminos' },
  { texto: 'Política de privacidad', ruta: '/privacidad' },
  { texto: 'Cambios y devoluciones', ruta: '/cambios-devoluciones' },
];

// Redes sociale
const REDES_SOCIALES = [
  {
    nombre: 'Instagram',
    url: 'https://instagram.com/hermanosjota_ba',
    icono: '/icons/instagram.svg',
  },
  {
    nombre: 'WhatsApp',
    url: 'https://wa.me/5491145678900',
    icono: '/icons/whatsapp.svg',
  },
];

export default function Footer() {
  // El año se calcula solo, así no hay que actualizarlo a mano
  const anioActual = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">

        {/* Marca */}
        <div className="site-footer__brand">
          <div className="site-footer__logo">
            <img
              src="/images/branding/isotipo.png"
              alt=""
              width="28"
              height="34"
            />
            <span className="header__wordmark">Hermanos Jota</span>
          </div>
          <p>
            Muebles artesanales en madera, fabricados a mano en nuestro
            taller desde hace más de 20 años.
          </p>
        </div>

        {/* Navegación */}
        <nav className="site-footer__nav">
          <h2>Navegación</h2>
          <ul>
            {LINKS_NAVEGACION.map((link) => (
              <li key={link.ruta}>
                <Link to={link.ruta}>{link.texto}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Información legal */}
        <div className="site-footer__legal">
          <h2>Información legal</h2>
          <ul>
            {LINKS_LEGALES.map((link) => (
              <li key={link.ruta}>
                <Link to={link.ruta}>{link.texto}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div className="site-footer__contacto">
          <h2>Contacto</h2>
          <address>
            <p>
              <a href="mailto:info@hermanosjota.com.ar">info@hermanosjota.com.ar</a>
            </p>
            <p>
              <a href="https://wa.me/5491145678900">+54 11 4567-8900</a>
            </p>
            <p>
              Av. San Juan 2847, C1232AAB
              <br />
              Barrio de San Cristóbal, CABA, Argentina
            </p>
            <p className="site-footer__horarios">
              Lun. a Vie. 10:00–19:00 · Sáb. 10:00–14:00
            </p>
          </address>

          <ul className="site-footer__social">
            {REDES_SOCIALES.map((red) => (
              <li key={red.nombre}>
                <a
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={red.nombre}
                >
                  <img src={red.icono} alt="" width="24" height="24" />
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="site-footer__bottom">
        <p>&copy; {anioActual} Hermanos Jota. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}