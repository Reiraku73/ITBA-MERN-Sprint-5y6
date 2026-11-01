import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../components/ui/FormField.jsx';
import { EMAIL_VALIDO, TELEFONO_VALIDO } from '../utils/validators.js';

const FORM_VACIO = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  password: '',
  confirmacion: '',
};

function Register({ onRegistrar }) {
  const [form, setForm] = useState(FORM_VACIO);
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validar(datos) {
    const nuevosErrores = {};

    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = 'Ingresá tu nombre.';
    }

    if (!datos.apellido.trim()) {
      nuevosErrores.apellido = 'Ingresá tu apellido.';
    }

    if (!datos.email.trim()) {
      nuevosErrores.email = 'Ingresá tu email.';
    } else if (!EMAIL_VALIDO.test(datos.email)) {
      nuevosErrores.email = 'Ese email no parece válido (ej: nombre@mail.com).';
    }

    if (datos.telefono.trim() && !TELEFONO_VALIDO.test(datos.telefono)) {
      nuevosErrores.telefono = 'Ese teléfono no parece válido.';
    }

    if (datos.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (!datos.confirmacion) {
      nuevosErrores.confirmacion = 'Repetí tu contraseña.';
    } else if (datos.confirmacion !== datos.password) {
      nuevosErrores.confirmacion = 'Las contraseñas no coinciden.';
    }

    return nuevosErrores;
  }

  function enviar(e) {
    e.preventDefault();

    const erroresEncontrados = validar(form);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) return;

    const { confirmacion, ...datos } = form;
    const mensaje = onRegistrar(datos);

    if (mensaje) {
      setErrores({ email: mensaje });
      return;
    }

    navigate('/login');
  }

  return (
    <section className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Crear cuenta</h1>

        <form className="auth__form" onSubmit={enviar} noValidate>
          <div className="cuenta__row">
            <FormField
              id="nombre"
              label="Nombre"
              type="text"
              autoComplete="given-name"
              value={form.nombre}
              onChange={cambiar}
              error={errores.nombre}
            />
            <FormField
              id="apellido"
              label="Apellido"
              type="text"
              autoComplete="family-name"
              value={form.apellido}
              onChange={cambiar}
              error={errores.apellido}
            />
          </div>

          <FormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={cambiar}
            error={errores.email}
          />

          <FormField
            id="telefono"
            label="Teléfono (opcional)"
            type="tel"
            autoComplete="tel"
            value={form.telefono}
            onChange={cambiar}
            error={errores.telefono}
          />

          <FormField
            id="password"
            label="Contraseña"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={cambiar}
            error={errores.password}
          />

          <FormField
            id="confirmacion"
            label="Repetir contraseña"
            type="password"
            autoComplete="new-password"
            value={form.confirmacion}
            onChange={cambiar}
            error={errores.confirmacion}
          />

          <button type="submit" className="btn btn--primary auth__submit">
            Crear cuenta
          </button>
        </form>

        <p className="auth__extra">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
