import { useState } from 'react';

/**
 * <img> que no deja un ícono de imagen rota: si no hay `src` o el archivo
 * no carga (URL mal escrita, imagen borrada, sin red), muestra un recuadro
 * con el mismo tamaño y un texto, para que el layout no salte y la persona
 * entienda qué pasó.
 *
 * `alt` también es lo que se anuncia si la imagen no carga; con alt vacío
 * (imagen decorativa, ej. una miniatura) el recuadro tampoco se anuncia.
 */
export default function SafeImage({ src, alt, className, width, height, ...rest }) {
  // Se guarda QUÉ src falló (no un booleano): si el `src` cambia (ej. otra
  // imagen del visor) vuelve a intentar en vez de quedar rota para siempre.
  const [failedSrc, setFailedSrc] = useState(null);
  const broken = !src || failedSrc === src;

  if (broken) {
    return (
      <div
        className={`safe-image safe-image--broken${className ? ` ${className}` : ''}`}
        {...(alt
          ? { role: 'img', 'aria-label': `${alt} (imagen no disponible)` }
          : { 'aria-hidden': true })}
        style={{ aspectRatio: width && height ? `${width} / ${height}` : undefined }}
      >
        <span aria-hidden="true">Imagen no disponible</span>
      </div>
    );
  }

  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
