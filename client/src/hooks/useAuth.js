import { useState, useEffect } from 'react';

const CLAVE_USUARIOS = 'usuarios';
const CLAVE_SESION = 'sesion';

function leerStorage(clave, valorPorDefecto) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : valorPorDefecto;
  } catch {
    return valorPorDefecto;
  }
}

/**
 * ⚠️  AUTENTICACIÓN SIMULADA (MOCK), SOLO PARA LA CONSIGNA DEL CURSO.
 *
 * Los usuarios se guardan en localStorage CON LA CONTRASEÑA EN TEXTO PLANO y
 * la comparación se hace en el navegador. Esto NUNCA se hace en un proyecto
 * real: localStorage lo puede leer cualquier script de la página o cualquiera
 * con acceso al equipo, y una contraseña no se compara en el cliente.
 *
 * En un proyecto real:
 *  - el registro y el login van contra el backend (HTTPS);
 *  - la contraseña se guarda hasheada con bcrypt/argon2 (con salt);
 *  - el backend devuelve un token (JWT firmado o cookie httpOnly) y el
 *    frontend nunca ve ni guarda la contraseña.
 */
export function useAuth() {
  const [usuarios, setUsuarios] = useState(() => leerStorage(CLAVE_USUARIOS, []));
  const [usuario, setUsuario] = useState(() => leerStorage(CLAVE_SESION, null));

  useEffect(() => {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    if (usuario) localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    else localStorage.removeItem(CLAVE_SESION);
  }, [usuario]);

  function registrarUsuario(datos) {
    const email = datos.email.trim().toLowerCase();

    if (usuarios.some((u) => u.email === email)) {
      return 'Ese email ya está registrado.';
    }

    setUsuarios((prev) => [...prev, { id: Date.now(), ...datos, email }]);
    return null;
  }

  function iniciarSesion({ email, password }) {
    const emailNormalizado = email.trim().toLowerCase();
    const encontrado = usuarios.find(
      (u) => u.email === emailNormalizado && u.password === password,
    );

    if (!encontrado) return 'Email o contraseña incorrectos.';

    const { password: _, ...usuarioPublico } = encontrado;
    setUsuario(usuarioPublico);
    return null;
  }

  function cerrarSesion() {
    setUsuario(null);
  }

  function actualizarUsuario({ nombre, apellido, telefono, passwordActual, passwordNueva }) {
    const actual = usuarios.find((u) => u.id === usuario.id);

    if (!actual) return 'No se encontró el usuario.';

    // Solo se pide la contraseña actual si quieren cambiarla.
    if (passwordNueva && passwordActual !== actual.password) {
      return 'La contraseña actual es incorrecta.';
    }

    const actualizado = {
      ...actual,
      nombre,
      apellido,
      telefono,
      password: passwordNueva || actual.password,
    };

    // map devuelve un array NUEVO, sin mutar el anterior.
    setUsuarios((prev) => prev.map((u) => (u.id === actual.id ? actualizado : u)));

    // La sesión se guarda sin contraseña.
    const { password: _, ...usuarioPublico } = actualizado;
    setUsuario(usuarioPublico);
    return null;
  }

  return { usuario, registrarUsuario, iniciarSesion, cerrarSesion, actualizarUsuario };
}
