import { useOpinions } from '../../hooks/useOpinions';

const CANTIDAD_SKELETONS = 3;

function Opinions() {
  const { opiniones, cargando, error } = useOpinions();

  return (
    <section className="opiniones">
      <h2>Lo que dicen nuestros clientes</h2>

      <ul className="opiniones__grid">
        {cargando &&
          Array.from({ length: CANTIDAD_SKELETONS }).map((_, i) => (
            <li key={`skeleton-${i}`} className="skeleton-card" aria-hidden="true"></li>
          ))}

        {error && (
          <li className="estado-error">
            No pudimos cargar las opiniones. Probá recargar la página.
          </li>
        )}

        {!cargando &&
          !error &&
          opiniones.map((opinion) => (
            <li key={opinion.id}>
              <figure className="opinion-card">
                <blockquote>
                  <p>{opinion.texto}</p>
                </blockquote>
                <figcaption>
                  <img src={opinion.avatar} alt="" width="40" height="40" />
                  <span className="opinion-card__nombre">{opinion.nombre}</span>
                  <span
                    className="opinion-card__rating"
                    role="img"
                    aria-label={`${opinion.rating} de 5 estrellas`}
                  >
                    {'★'.repeat(opinion.rating)}
                    {'☆'.repeat(5 - opinion.rating)}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
      </ul>
    </section>
  );
}

export default Opinions;
