import { Link } from 'react-router-dom';

function CambiosDevoluciones() {
  return (
    <>
      <section className="legal-hero" aria-labelledby="cambios-title">
        <h1 id="cambios-title">Cambios y devoluciones</h1>
        <p>Última actualización: Octubre de 2026</p>
      </section>

      <section className="legal-content">
        <article>
          <h2>1. Plazo para solicitar un cambio o devolución</h2>
          <p>
            Tenés hasta 10 días corridos desde la recepción del producto para solicitar un cambio o
            devolución, siempre que se encuentre en su estado original, sin uso, y con su embalaje
            correspondiente.
          </p>
        </article>

        <article>
          <h2>2. Cómo iniciar el proceso</h2>
          <p>
            Escribinos por email o WhatsApp indicando tu número de pedido y el motivo del cambio o
            devolución. Te vamos a confirmar los pasos a seguir y, si corresponde, coordinar el
            retiro del producto.
          </p>
        </article>

        <article>
          <h2>3. Estado del producto</h2>
          <p>
            El mueble debe devolverse sin señales de uso, rayones ni daños, en su embalaje original.
            Si el producto presenta desperfectos de fabricación, la devolución no tiene costo; si es
            por cambio de opinión, el costo del flete de retiro corre por cuenta del cliente.
          </p>
        </article>

        <article>
          <h2>4. Reintegro del dinero</h2>
          <p>
            Una vez que recibimos e inspeccionamos el producto devuelto, procesamos el reintegro
            dentro de los 10 días hábiles, utilizando el mismo medio de pago con el que se realizó
            la compra.
          </p>
        </article>

        <article>
          <h2>5. Programa Herencia Viva</h2>
          <p>
            Todos nuestros productos incluyen el Programa Herencia Viva, con garantía extendida de
            10 años en estructura y 5 años en acabados, servicio de restauración y recompra de hasta
            el 40% del valor original. Podés ver más detalles en la sección de Materiales
            sustentables del inicio.
          </p>
        </article>

        <article>
          <h2>6. Excepciones</h2>
          <p>
            No se aceptan cambios ni devoluciones en productos hechos a medida o personalizados por
            pedido especial, salvo que presenten defectos de fabricación.
          </p>
        </article>

        <article>
          <h2>7. Contacto</h2>
          <p>
            Ante cualquier consulta sobre cambios o devoluciones, escribinos a
            <a href="mailto:info@hermanosjota.com.ar">info@hermanosjota.com.ar</a>o por WhatsApp al{' '}
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

export default CambiosDevoluciones;
