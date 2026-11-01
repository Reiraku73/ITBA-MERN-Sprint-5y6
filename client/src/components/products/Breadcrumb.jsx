import { Link } from 'react-router-dom';

export default function Breadcrumb({ producto }) {
  return (
    <nav className="pdp__breadcrumb" aria-label="Ruta de navegación">
      <ol>
        <li>
          <Link to="/productos">Productos</Link>
        </li>
        <li>{producto.categoria}</li>
        <li aria-current="page">{producto.nombre}</li>
      </ol>
    </nav>
  );
}
