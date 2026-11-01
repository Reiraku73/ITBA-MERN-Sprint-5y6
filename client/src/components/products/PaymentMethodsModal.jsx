import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { PAYMENT_CATEGORIES } from '../../data/paymentMethods';
import { useDialog } from '../../hooks/useDialog';
import PaymentLogo from './PaymentLogo';

/** Detalle de los medios de pago, con las mismas categorías de la franja. */
export default function PaymentMethodsModal({ onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useDialog({ containerRef: dialogRef, initialFocusRef: closeRef, onClose });

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-modal-title"
        ref={dialogRef}
      >
        <header className="modal__header">
          <h2 id="pay-modal-title">Medios de pago</h2>
          <button
            ref={closeRef}
            type="button"
            className="modal__close"
            aria-label="Cerrar medios de pago"
            onClick={onClose}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </header>

        <div className="modal__body">
          {PAYMENT_CATEGORIES.map((category) => (
            <section key={category.id} className="pay-modal__category">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <ul className="pay-modal__methods">
                {category.methods.map((method) => (
                  <li key={method.id}>
                    <PaymentLogo id={method.id} />
                    <span>{method.name}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <footer className="modal__footer">
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
