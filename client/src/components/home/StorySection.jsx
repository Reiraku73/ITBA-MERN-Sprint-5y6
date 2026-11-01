function History() {
  return (
    <section id="historia" className="historia">
      <div className="historia__content">
        <h2>Nuestra historia</h2>
        <p>
          Hermanos Jota nació en un pequeño taller de carpintería familiar, donde dos hermanos
          aprendieron el oficio de la madera de manos de su padre. Lo que empezó como encargos para
          vecinos se convirtió, con los años, en una marca reconocida por su calidad artesanal.
        </p>
        <p>
          Hoy seguimos trabajando cada pieza a mano, combinando técnicas tradicionales de
          carpintería con diseño contemporáneo, para que cada mueble cuente una historia propia
          dentro de tu hogar.
        </p>
      </div>

      <figure className="historia__media">
        <img
          src="/images/relacionadas/nuestra_historia.png"
          alt="Carpintero trabajando la madera con herramientas manuales en un taller"
          loading="lazy"
        />
      </figure>
    </section>
  );
}

export default History;
