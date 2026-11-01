import { Component } from 'react';

// Red de seguridad para errores de RENDER (un bug, o un dato de la API con
// una forma inesperada): sin esto, React desmonta toda la app y la persona
// ve una pantalla en blanco. Los errores de red/HTTP NO llegan acá: esos se
// manejan en cada pantalla con <Alert>.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main>
        <section className="state-message state-message--error" role="alert">
          <h1>Algo salió mal</h1>
          <p>Tuvimos un problema al mostrar esta página. Probá recargarla o volver al inicio.</p>
          <p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              Recargar página
            </button>{' '}
            <a href="/" className="btn btn--secondary">
              Ir al inicio
            </a>
          </p>
        </section>
      </main>
    );
  }
}
