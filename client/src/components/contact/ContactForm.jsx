import { useState } from 'react';
import { EMAIL_VALIDO } from '../../utils/validators.js';

const FORM_VACIO = { nombre: '', email: '', mensaje: '' };

function validar(datos) {
  const nuevosErrores = {};

  if (!datos.nombre.trim()) {
    nuevosErrores.nombre = 'Ingresá tu nombre.';
  }

  if (!datos.email.trim()) {
    nuevosErrores.email = 'Ingresá tu email.';
  } else if (!EMAIL_VALIDO.test(datos.email)) {
    nuevosErrores.email = 'Ese email no parece válido (ej: nombre@mail.com).';
  }

  if (datos.mensaje.trim().length < 10) {
    nuevosErrores.mensaje = 'Contanos un poco más: al menos 10 caracteres.';
  }

  return nuevosErrores;
}

// Formulario de contacto con validación y mensaje de éxito.
export default function ContactForm() {
  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();

    const erroresEncontrados = validar(form);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) return;

    console.log('Formulario enviado:', form);
    setForm(FORM_VACIO);
    setEnviado(true);
  }

  return (
    <div className="contacto__form-card">
      {enviado ? (
        <div className="contacto__exito">
          <h2>¡Gracias por escribirnos!</h2>
          <p>Recibimos tu mensaje y te vamos a responder a la brevedad.</p>
          <button type="button" className="btn btn--primary" onClick={() => setEnviado(false)}>
            Enviar otra consulta
          </button>
        </div>
      ) : (
        <>
          <h2 className="contacto__form-title">Envianos tu consulta</h2>
          <form className="contacto__form" onSubmit={enviar} noValidate>
            <div className="form-field">
              <div className="form-field__control">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder=" "
                  value={form.nombre}
                  onChange={cambiar}
                />
                <label htmlFor="nombre">Nombre</label>
              </div>
              <p className="form-field__error" role="alert">
                {errores.nombre}
              </p>
            </div>

            <div className="form-field">
              <div className="form-field__control">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder=" "
                  value={form.email}
                  onChange={cambiar}
                />
                <label htmlFor="email">Correo electrónico</label>
              </div>
              <p className="form-field__error" role="alert">
                {errores.email}
              </p>
            </div>

            <div className="form-field">
              <div className="form-field__control">
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows="4"
                  placeholder=" "
                  value={form.mensaje}
                  onChange={cambiar}
                ></textarea>
                <label htmlFor="mensaje">Mensaje</label>
              </div>
              <p className="form-field__error" role="alert">
                {errores.mensaje}
              </p>
            </div>

            <button type="submit" className="btn btn--primary contacto__submit">
              Enviar mensaje
            </button>
          </form>
        </>
      )}
    </div>
  );
}
