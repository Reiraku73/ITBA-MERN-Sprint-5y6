import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import SafeImage from './SafeImage';
import { useDialog } from '../../hooks/useDialog';
import { formatCounter } from '../../utils/formatCounter';

// Distancia mínima (px) de un gesto horizontal para contarlo como "pasar".
const SWIPE_THRESHOLD = 50;

/**
 * Visor de imágenes a pantalla completa (lightbox).
 *
 * Props:
 *  - images: [{ src, alt }]
 *  - startIndex: posición de la imagen que se abre primero (0 = la primera)
 *  - onClose
 *  - onIndexChange(index): se avisa cada vez que cambia la imagen mostrada
 *    (para sincronizar la galería).
 *
 * Navegación CIRCULAR (de la última se pasa a la primera y al revés), igual
 * en los botones, en las flechas del teclado y en el gesto de deslizar.
 *  - Cierra con Escape, con el botón ✕ o haciendo click fuera de la imagen.
 *  - Accesible: role="dialog" modal, foco atrapado y devuelto al cerrar.
 *  - La imagen se ajusta al espacio disponible sin deformarse (object-fit).
 */
export default function ImageViewer({ images, startIndex = 0, onClose, onIndexChange }) {
  const [index, setIndex] = useState(() => Math.min(Math.max(startIndex, 0), images.length - 1));
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const touchStart = useRef(null);
  const hasMany = images.length > 1;

  useDialog({ containerRef: dialogRef, initialFocusRef: closeRef, onClose });

  const go = useCallback(
    (delta) => setIndex((i) => (i + delta + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  useEffect(() => {
    if (!hasMany) return;
    function handleKeyDown(e) {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [go, hasMany]);

  const current = images[index];
  if (!current) return null;

  return createPortal(
    // El click en el fondo oscuro (y solo ahí: el target tiene que ser el
    // propio contenedor) cierra el visor.
    <div
      className="image-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`Visor de imágenes: ${current.alt}`}
      ref={dialogRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        className="image-viewer__btn image-viewer__close"
        aria-label="Cerrar visor de imágenes"
        onClick={onClose}
      >
        <span aria-hidden="true">✕</span>
      </button>

      {hasMany && (
        <button
          type="button"
          className="image-viewer__btn image-viewer__nav image-viewer__nav--prev"
          aria-label="Imagen anterior"
          onClick={() => go(-1)}
        >
          <span aria-hidden="true">‹</span>
        </button>
      )}

      <figure
        className="image-viewer__figure"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchStart.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || !hasMany) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          // Solo gestos mayormente horizontales: un scroll vertical
          // accidental no cambia de imagen.
          if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
        }}
      >
        <SafeImage
          key={current.src}
          src={current.src}
          alt={current.alt}
          className="image-viewer__img"
        />
        {hasMany && (
          <figcaption className="image-viewer__counter" aria-live="polite">
            {formatCounter(index + 1, images.length)}
          </figcaption>
        )}
      </figure>

      {hasMany && (
        <button
          type="button"
          className="image-viewer__btn image-viewer__nav image-viewer__nav--next"
          aria-label="Imagen siguiente"
          onClick={() => go(1)}
        >
          <span aria-hidden="true">›</span>
        </button>
      )}
    </div>,
    document.body,
  );
}
