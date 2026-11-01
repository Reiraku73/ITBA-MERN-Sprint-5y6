import { useEffect } from 'react';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Comportamiento común de cualquier diálogo modal (el visor de imágenes y
 * el modal de medios de pago lo comparten):
 *  - el foco entra al diálogo al abrir y vuelve al elemento que lo abrió;
 *  - el Tab queda atrapado adentro;
 *  - Escape cierra;
 *  - el scroll del fondo se bloquea mientras está abierto, sin que la
 *    página "salte" por la desaparición de la barra de scroll.
 *
 * containerRef: contenedor del diálogo. initialFocusRef: qué recibe el foco
 * al abrir (por defecto, el primer enfocable).
 */
export function useDialog({ containerRef, initialFocusRef, onClose }) {
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const target =
      initialFocusRef?.current ??
      containerRef.current?.querySelector(FOCUSABLE) ??
      containerRef.current;
    target?.focus();
    return () => previouslyFocused?.focus?.();
    // Solo al abrir/cerrar: los refs son estables.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    // Al ocultar el scroll la página se ensancha unos píxeles y todo se
    // corre; se compensa con padding igual al ancho de la barra.
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !containerRef.current) return;

      const focusable = Array.from(containerRef.current.querySelectorAll(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, onClose]);
}
