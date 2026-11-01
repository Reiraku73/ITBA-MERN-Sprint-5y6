import { useState } from 'react';
import ImageViewer from '../ui/ImageViewer';
import SafeImage from '../ui/SafeImage';
import { ExpandIcon } from '../ui/Icons';
import { formatCounter } from '../../utils/formatCounter';

// Cantidad de miniaturas visibles en la columna. El resto de las imágenes
// no se muestra como miniatura: se alcanza desde el "+N" de la última.
export const VISIBLE_THUMBS = 4;

/**
 * Galería del producto: imagen principal + hasta 4 miniaturas.
 *  - Click en una miniatura → esa imagen pasa a ser la principal.
 *  - Click en la imagen principal → abre el visor en la imagen actual.
 *  - Si hay más de 4 imágenes, la 4.ª miniatura muestra "+N" (N = las que
 *    no entran) y al hacer click abre el visor en la 4.ª imagen.
 *  - Al cerrar el visor, la principal queda en la última imagen que se vio.
 *
 * Las imágenes salen de `producto.imagenes` (varias) o, si el producto
 * tiene una sola, de `producto.imagen`. Miniaturas, contador y visor salen
 * del mismo array.
 */
export default function ProductGallery({ producto }) {
  const images = (producto.imagenes ?? [producto.imagen]).filter(Boolean);
  const name = producto.nombre;

  const [selected, setSelected] = useState(0);
  // null = visor cerrado; un número = abierto empezando en esa imagen.
  const [viewerStart, setViewerStart] = useState(null);

  const total = images.length;
  const current = Math.min(selected, Math.max(total - 1, 0));

  const thumbs = images.slice(0, VISIBLE_THUMBS);
  const extra = Math.max(total - VISIBLE_THUMBS, 0);

  if (total === 0) {
    // Producto sin imágenes: recuadro de "no disponible", sin visor.
    return (
      <div className="producto-gallery">
        <div className="producto-gallery__stage">
          <SafeImage src={null} alt={name} width={800} height={800} />
        </div>
      </div>
    );
  }

  const mainLabel =
    total > 1
      ? `Ampliar imagen de ${name} (imagen ${current + 1} de ${total})`
      : `Ampliar imagen de ${name}`;

  return (
    <div className="producto-gallery">
      {total > 1 && (
        <ul className="producto-gallery__thumbs" aria-label={`Imágenes de ${name}`}>
          {thumbs.map((src, i) => {
            const isLastSlot = i === VISIBLE_THUMBS - 1;
            const showMore = isLastSlot && extra > 0;

            return (
              <li key={`${src}-${i}`}>
                <button
                  type="button"
                  className={`producto-gallery__thumb${showMore ? ' producto-gallery__thumb--more' : ''}`}
                  aria-current={!showMore && i === current ? 'true' : undefined}
                  aria-label={
                    showMore
                      ? `Ver las ${total} imágenes (${extra} más)`
                      : `Ver imagen ${i + 1} de ${total}`
                  }
                  onClick={() => (showMore ? setViewerStart(i) : setSelected(i))}
                >
                  <SafeImage src={src} alt="" width={96} height={96} loading="lazy" />
                  {showMore && (
                    <span className="producto-gallery__more" aria-hidden="true">
                      +{extra}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="producto-gallery__stage">
        <button
          type="button"
          className="producto-gallery__main"
          aria-label={mainLabel}
          onClick={() => setViewerStart(current)}
        >
          {/* key: al cambiar de imagen se vuelve a montar y se anima la entrada */}
          <SafeImage
            key={images[current]}
            src={images[current]}
            alt={name}
            width={800}
            height={800}
          />
          {total > 1 && (
            <span className="producto-gallery__counter" aria-hidden="true">
              {formatCounter(current + 1, total)}
            </span>
          )}
          <span className="producto-gallery__expand" aria-hidden="true">
            <ExpandIcon />
          </span>
        </button>
      </div>

      {viewerStart !== null && (
        <ImageViewer
          images={images.map((src, i) => ({
            src,
            alt: total > 1 ? `${name} (${i + 1} de ${total})` : name,
          }))}
          startIndex={viewerStart}
          onIndexChange={setSelected}
          onClose={() => setViewerStart(null)}
        />
      )}
    </div>
  );
}
