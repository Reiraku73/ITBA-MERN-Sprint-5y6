import { Link } from 'react-router-dom';

function Terminos() {
  return (
    <>
      <section className="legal-hero" aria-labelledby="terminos-title">
        <h1 id="terminos-title">Términos y condiciones</h1>
        <p>Última actualización: septiembre de 2026</p>
      </section>

      <section className="legal-content">
        <article>
          <h2>1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar el sitio de Hermanos Jota, aceptás los presentes términos y
            condiciones. Si no estás de acuerdo con alguno de sus puntos, te pedimos que no utilices
            este sitio ni realices compras a través de él.
          </p>
        </article>

        <article>
          <h2>2. Productos y precios</h2>
          <p>
            Todos nuestros muebles son de fabricación artesanal, por lo que pueden existir pequeñas
            variaciones de color, veta o terminación respecto a las imágenes publicadas. Los precios
            están expresados en pesos argentinos e incluyen impuestos vigentes, salvo que se indique
            lo contrario.
          </p>
        </article>

        <article>
          <h2>3. Envíos</h2>
          <p>
            Realizamos envíos a todo el país. Los plazos de entrega son estimados y pueden variar
            según la localidad y las condiciones logísticas del momento.
          </p>
        </article>

        <article>
          <h2>4. Garantía</h2>
          <p>
            Todos los productos cuentan con garantía de 2 años sobre defectos de fabricación,
            contados desde la fecha de compra.
          </p>
        </article>

        <article>
          <h2>5. Cambios y devoluciones</h2>
          <p>
            Podés solicitar un cambio o devolución dentro de los 10 días corridos posteriores a la
            recepción del producto, siempre que se encuentre en su estado original, sin uso y con su
            embalaje correspondiente.
          </p>
        </article>

        <article>
          <h2>6. Métodos de pago</h2>
          <p>
            Aceptamos tarjetas de crédito y débito, transferencia bancaria y pago en cuotas a través
            de nuestra pasarela de pagos.
          </p>
        </article>

        <article>
          <h2>7. Propiedad intelectual</h2>
          <p>
            Todo el contenido de este sitio es propiedad de Hermanos Jota y está protegido por las
            leyes de propiedad intelectual vigentes.
          </p>
        </article>

        <article>
          <h2>8. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos y condiciones en cualquier
            momento. Los cambios entrarán en vigencia desde su publicación en este sitio.
          </p>
        </article>

        <article>
          <h2>9. Contacto</h2>
          <p>
            Ante cualquier consulta sobre estos términos, podés escribirnos a{' '}
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

export default Terminos;
