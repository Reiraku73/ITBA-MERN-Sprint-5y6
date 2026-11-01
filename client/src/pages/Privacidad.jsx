import { Link } from 'react-router-dom';

function Privacidad() {
  return (
    <>
      <section className="legal-hero" aria-labelledby="privacidad-title">
        <h1 id="privacidad-title">Política de privacidad</h1>
        <p>Última actualización: septiembre de 2026</p>
      </section>

      <section className="legal-content">
        <article>
          <h2>1. Datos que recopilamos</h2>
          <p>
            Cuando comprás en nuestro sitio o te suscribís al newsletter, recopilamos datos como
            nombre, email, teléfono y dirección de envío.
          </p>
        </article>

        <article>
          <h2>2. Uso de la información</h2>
          <p>
            Utilizamos tus datos exclusivamente para procesar pedidos, coordinar envíos, responder
            consultas y, si lo aceptaste, enviarte novedades por email. Nunca vendemos tu
            información a terceros.
          </p>
        </article>

        <article>
          <h2>3. Cookies</h2>
          <p>
            Nuestro sitio utiliza cookies propias para recordar el contenido de tu carrito de
            compras y mejorar tu experiencia de navegación.
          </p>
        </article>

        <article>
          <h2>4. Seguridad de los datos</h2>
          <p>
            Implementamos medidas técnicas y organizativas para proteger tu información personal
            contra accesos no autorizados, pérdida o alteración.
          </p>
        </article>

        <article>
          <h2>5. Derechos del usuario</h2>
          <p>
            Podés solicitar en cualquier momento el acceso, la rectificación o la eliminación de tus
            datos personales, escribiéndonos a{' '}
            <a href="mailto:info@hermanosjota.com.ar">info@hermanosjota.com.ar</a>.
          </p>
        </article>

        <article>
          <h2>6. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta política periódicamente. Cualquier cambio será publicado en esta
            misma página, con la fecha de última actualización correspondiente.
          </p>
        </article>

        <article>
          <h2>7. Contacto</h2>
          <p>
            Ante cualquier consulta sobre el tratamiento de tus datos, escribinos a{' '}
            <a href="mailto:info@hermanosjota.com.ar">info@hermanosjota.com.ar</a> o por WhatsApp al{' '}
            <a href="https://wa.me/5491145678900">+54 11 4567-8900</a>.
          </p>
        </article>
      </section>

      <Link to="/" className="btn btn--primary legal-content__volver">
        Volver al inicio
      </Link>
    </>
  );
}

export default Privacidad;
