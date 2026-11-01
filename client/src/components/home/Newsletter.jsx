import { useState } from 'react';
import { EMAIL_VALIDO } from '../../utils/validators.js';

function NewsLetter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [suscripto, setSuscripto] = useState(false);

  function cambiar(e) {
    setEmail(e.target.value);
  }

  function enviar(e) {
    e.preventDefault();

    if (!email.trim()) {
      setError('Ingresá tu email.');
      setSuscripto(false);
      return;
    }

    if (!EMAIL_VALIDO.test(email)) {
      setError('Ese email no parece válido (ej: nombre@mail.com).');
      setSuscripto(false);
      return;
    }

    // TODO: conectar con el backend cuando esté el endpoint de newsletter
    console.log('Suscripción enviada:', email);
    setError('');
    setEmail('');
    setSuscripto(true);
  }

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="newsletter__content">
        <h2 id="newsletter-title">Sumate a nuestra comunidad</h2>
        <p>
          Recibí novedades, lanzamientos y descuentos exclusivos directo en tu correo. Sin spam,
          podés darte de baja cuando quieras.
        </p>
        <form className="newsletter__form" onSubmit={enviar} noValidate>
          <div className="newsletter__field">
            <label htmlFor="newsletter-email">Correo electrónico</label>
            <input
              type="email"
              id="newsletter-email"
              name="email"
              placeholder="tu@email.com"
              autoComplete="email"
              value={email}
              onChange={cambiar}
              aria-describedby="newsletter-hint"
            />
            {error && (
              <p className="form-field__error" role="alert">
                {error}
              </p>
            )}
            <p id="newsletter-hint" className="newsletter__hint">
              Usamos tu correo únicamente para enviarte novedades de Hermanos Jota.
            </p>
          </div>

          <button type="submit" className="btn btn--primary">
            Suscribirme
          </button>
        </form>
        {suscripto && (
          <p className="newsletter__exito" role="status">
            ¡Gracias por suscribirte!
          </p>
        )}
      </div>
    </section>
  );
}

export default NewsLetter;
