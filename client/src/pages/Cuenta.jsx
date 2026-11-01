import { useState } from 'react';
import FormField from '../components/ui/FormField.jsx';
import { TELEFONO_VALIDO } from '../utils/validators.js';

function formDesdeUsuario(usuario) {
  return {
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    telefono: usuario.telefono || '',
    passwordActual: '',
    passwordNueva: '',
    confirmacion: '',
  };
}

function Cuenta({ usuario, onActualizar, onLogout }) {
  const [form, setForm] = useState(() => formDesdeUsuario(usuario));
  const [errores, setErrores] = useState({});
  const [editando, setEditando] = useState(false);
  const [exito, setExito] = useState(false);

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function empezarEdicion() {
    setExito(false);
    setEditando(true);
  }

  function cancelar() {
    setForm(formDesdeUsuario(usuario));
    setErrores({});
    setEditando(false);
  }

  function validar(datos) {
    const nuevosErrores = {};

    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = 'Ingresá tu nombre.';
    }

    if (!datos.apellido.trim()) {
      nuevosErrores.apellido = 'Ingresá tu apellido.';
    }

    if (datos.telefono.trim() && !TELEFONO_VALIDO.test(datos.telefono)) {
      nuevosErrores.telefono = 'Ese teléfono no parece válido.';
    }

    const cambiandoPassword = datos.passwordActual || datos.passwordNueva || datos.confirmacion;

    if (cambiandoPassword) {
      if (!datos.passwordActual) {
        nuevosErrores.passwordActual = 'Ingresá tu contraseña actual.';
      }

      if (datos.passwordNueva.length < 6) {
        nuevosErrores.passwordNueva = 'La contraseña debe tener al menos 6 caracteres.';
      }

      if (!datos.confirmacion) {
        nuevosErrores.confirmacion = 'Repetí la nueva contraseña.';
      } else if (datos.confirmacion !== datos.passwordNueva) {
        nuevosErrores.confirmacion = 'Las contraseñas no coinciden.';
      }
    }

    return nuevosErrores;
  }

  function enviar(e) {
    e.preventDefault();

    const erroresEncontrados = validar(form);
    setErrores(erroresEncontrados);
    if (Object.keys(erroresEncontrados).length > 0) return;

    const datos = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      telefono: form.telefono.trim(),
      passwordActual: form.passwordActual,
      passwordNueva: form.passwordNueva,
    };

    const mensaje = onActualizar(datos);
    if (mensaje) {
      setErrores({ passwordActual: mensaje });
      return;
    }

    setForm({
      ...form,
      nombre: datos.nombre,
      apellido: datos.apellido,
      telefono: datos.telefono,
      passwordActual: '',
      passwordNueva: '',
      confirmacion: '',
    });
    setEditando(false);
    setExito(true);
  }

  return (
    <section className="cuenta">
      <h1>Mi cuenta</h1>
      <p className="cuenta__intro">
        Estos son tus datos personales. Podés editarlos cuando quieras.
      </p>

      {exito && (
        <p className="cuenta__exito" role="status">
          Los datos se actualizaron correctamente.
        </p>
      )}

      <form className="cuenta__form" onSubmit={enviar} noValidate>
        <div className="cuenta__row">
          <FormField
            id="nombre"
            label="Nombre"
            type="text"
            autoComplete="given-name"
            readOnly={!editando}
            value={form.nombre}
            onChange={cambiar}
            error={errores.nombre}
          />
          <FormField
            id="apellido"
            label="Apellido"
            type="text"
            autoComplete="family-name"
            readOnly={!editando}
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
          readOnly
          disabled
          value={usuario.email}
        />

        <FormField
          id="telefono"
          label="Teléfono"
          type="tel"
          autoComplete="tel"
          readOnly={!editando}
          value={form.telefono}
          onChange={cambiar}
          error={errores.telefono}
        />

        {editando && (
          <fieldset className="cuenta__password">
            <legend>Cambiar contraseña (opcional)</legend>

            <FormField
              id="passwordActual"
              label="Contraseña actual"
              type="password"
              autoComplete="current-password"
              value={form.passwordActual}
              onChange={cambiar}
              error={errores.passwordActual}
            />

            <div className="cuenta__row">
              <FormField
                id="passwordNueva"
                label="Nueva contraseña"
                type="password"
                autoComplete="new-password"
                value={form.passwordNueva}
                onChange={cambiar}
                error={errores.passwordNueva}
              />
              <FormField
                id="confirmacion"
                label="Repetir nueva contraseña"
                type="password"
                autoComplete="new-password"
                value={form.confirmacion}
                onChange={cambiar}
                error={errores.confirmacion}
              />
            </div>
          </fieldset>
        )}

        <div className="cuenta__botones">
          {editando ? (
            <div className="cuenta__acciones">
              <button type="submit" className="btn btn--primary">
                Guardar cambios
              </button>
              <button type="button" className="btn btn--secondary" onClick={cancelar}>
                Cancelar
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn--secondary" onClick={empezarEdicion}>
              Editar datos
            </button>
          )}

          <button type="button" className="btn btn--secondary cuenta__logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </form>
    </section>
  );
}

export default Cuenta;
