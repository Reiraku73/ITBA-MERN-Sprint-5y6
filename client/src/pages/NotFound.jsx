import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <main className="not-found" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que estás buscando no existe o fue movida.</p>

      <Link to="/" className="btn btn--primary">
        Volver al Inicio
      </Link>
    </main>
  );
}
