import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductos } from '../../hooks/useProductos';
import SafeImage from '../ui/SafeImage';

export default function HeroCarousel() {
  const { productos: slidesArray, cargando, error, reintentar } = useProductos();
  const [slide, setSlide] = useState(0);

  const SLIDE_DURATION = 7000;


  useEffect(() => {
    const matches = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (matches) return;
    if (!slidesArray || slidesArray.length === 0) return;

    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % slidesArray.length);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(interval);
    };
  }, [slidesArray?.length]);

  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <h1>Muebles con historia, hechos para durar</h1>
          <p className="hero__subtitle">
            Diseño artesanal en madera maciza, pensado para acompañar tu casa
            por generaciones.
          </p>
          <Link to="/productos" className="btn btn--primary hero__cta">
            Ver colección
          </Link>
        </div>

        <div className="hero__media">
          {error ? (
            <div className="hero__carousel-error" style={{ padding: '2rem', textAlign: 'center', background: '#ffebee', color: '#c62828', borderRadius: '8px' }}>
              <p>⚠️ Ha habido un error: {error}</p>
              <button onClick={reintentar} className="btn btn--secondary" style={{ marginTop: '1rem' }}>
                Reintentar
              </button>
            </div>
          ) : cargando ? (
            <div className="hero__carousel-loading">Cargando destacados...</div>
          ) : slidesArray.length === 0 ? null : (
            <div className="hero__carousel" id="hero-carousel">
              {(() => {
                // ?? slidesArray[0]: si la lista se achica (se borra un
                // producto) el índice guardado puede quedar fuera de rango.
                const slideActual = slidesArray[slide] ?? slidesArray[0];

                return (
                  <Link
                    key={slideActual.id}
                    className="hero__carousel-slide"
                    to={`/productos/${slideActual.id}`}
                    style={{ '--slide-duration': `${SLIDE_DURATION}ms` }}
                  >
                    <SafeImage
                      className="hero__carousel-img"
                      src={slideActual.imagen}
                      alt={`${slideActual.nombre}, pieza destacada de Hermanos Jota`}
                    />
                  </Link>
                );
              })()}
            </div>
          )}
        </div>
      </section>
    </>
  );
}