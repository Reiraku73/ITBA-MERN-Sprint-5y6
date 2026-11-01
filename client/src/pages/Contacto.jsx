import ContactForm from '../components/contact/ContactForm';

export default function Contacto() {
  return (
    <section className="contacto">
      <div className="contacto__panel">
        <h1>Hablemos</h1>
        <p className="contacto__panel-intro">
          ¿Tenés una consulta sobre nuestros productos, un pedido especial o simplemente querés
          saber más sobre Hermanos Jota? Escribinos, te respondemos a la brevedad.
        </p>

        <ul className="contacto__beneficios">
          <li>
            <div>
              <h2>Atención personalizada</h2>
              <p>Te asesoramos para encontrar el mueble ideal para tu espacio.</p>
            </div>
          </li>
          <li>
            <div>
              <h2>Respuesta rápida</h2>
              <p>
                Contestamos en menos de 24hs hábiles, o escribinos directo por{' '}
                <a href="https://wa.me/5491145678900">WhatsApp</a>.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <ContactForm />
    </section>
  );
}
