import { useState } from 'react';
import { getErrorMessage } from '../../services/api.js';

const CATEGORIAS = ['Comedor', 'Dormitorio', 'Living', 'Oficina'];

const VALORES_VACIOS = {
  nombre: '',
  categoria: '',
  precio: '',
  stock: '',
  imagen: '',
  destacado: false,
  descripcion: '',
  specs: [],
};

// Pasa un producto de la API a valores de formulario (todo texto, salvo el checkbox).
function desdeProducto(producto) {
  return {
    nombre: producto.nombre ?? '',
    categoria: producto.categoria ?? '',
    precio: producto.precio != null ? String(producto.precio) : '',
    stock: producto.stock != null ? String(producto.stock) : '',
    imagen: producto.imagen ?? '',
    destacado: Boolean(producto.destacado),
    descripcion: producto.descripcion ?? '',
    specs: Array.isArray(producto.specs)
      ? producto.specs.map((s) => ({ label: s.label ?? '', value: s.value ?? '' }))
      : [],
  };
}

// Pasa los valores del formulario al formato que espera la API.
function aProducto(valores) {
  return {
    nombre: valores.nombre.trim(),
    categoria: valores.categoria,
    precio: Number(valores.precio),
    stock: Number(valores.stock),
    imagen: valores.imagen.trim(),
    destacado: valores.destacado,
    descripcion: valores.descripcion.trim(),
    specs: valores.specs
      .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
      .filter((s) => s.label && s.value),
  };
}

function validar(valores) {
  const errores = {};

  if (valores.nombre.trim().length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres.';
  }
  if (!CATEGORIAS.includes(valores.categoria)) {
    errores.categoria = 'Elegí una categoría.';
  }

  const precio = Number(valores.precio);
  if (valores.precio.trim() === '' || !Number.isFinite(precio) || precio <= 0) {
    errores.precio = 'Ingresá un precio mayor a 0.';
  }

  const stock = Number(valores.stock);
  if (valores.stock.trim() === '' || !Number.isInteger(stock) || stock < 0) {
    errores.stock = 'Ingresá un stock entero, 0 o mayor.';
  }

  const imagen = valores.imagen.trim();
  if (!imagen) {
    errores.imagen = 'Ingresá la ruta o URL de la imagen.';
  } else if (!/^(\/|https?:\/\/)/.test(imagen)) {
    errores.imagen = 'Tiene que empezar con "/" o con "http(s)://".';
  }

  if (valores.descripcion.trim().length < 20) {
    errores.descripcion = 'La descripción debe tener al menos 20 caracteres.';
  }

  // Una fila a medias (solo nombre o solo valor) es un error; una fila vacía se descarta.
  const filaIncompleta = valores.specs.some(
    (s) => Boolean(s.label.trim()) !== Boolean(s.value.trim()),
  );
  if (filaIncompleta) {
    errores.specs = 'Completá nombre y valor de cada especificación, o eliminá la fila.';
  }

  return errores;
}

function Campo({ id, label, error, children }) {
  return (
    <div className="admin-form__campo">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className="admin-form__error">
          {error}
        </p>
      )}
    </div>
  );
}

// Props:
//  - valoresIniciales: producto de la API (para editar). Sin esto, arranca vacío.
//  - onSubmit(producto): función async que guarda. Si lanza error, se muestra acá.
//  - textoBoton: "Crear producto", "Guardar cambios", etc.
export default function ProductoForm({ valoresIniciales, onSubmit, textoBoton = 'Guardar' }) {
  const [valores, setValores] = useState(
    valoresIniciales ? desdeProducto(valoresIniciales) : VALORES_VACIOS,
  );
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');
  const [guardando, setGuardando] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValores((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSpecChange(indice, campo, valor) {
    setValores((prev) => ({
      ...prev,
      specs: prev.specs.map((s, i) => (i === indice ? { ...s, [campo]: valor } : s)),
    }));
  }

  function agregarSpec() {
    setValores((prev) => ({ ...prev, specs: [...prev.specs, { label: '', value: '' }] }));
  }

  function quitarSpec(indice) {
    setValores((prev) => ({ ...prev, specs: prev.specs.filter((_, i) => i !== indice) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorServidor('');

    const nuevosErrores = validar(valores);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setGuardando(true);
    try {
      await onSubmit(aProducto(valores));
      // Si guardó bien, la página que usa este form navega a otro lado.
    } catch (err) {
      setErrorServidor(getErrorMessage(err, 'No pudimos guardar el producto. Probá de nuevo.'));
      setGuardando(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      {errorServidor && (
        <p className="admin-form__error-servidor" role="alert">
          {errorServidor}
        </p>
      )}

      <Campo id="nombre" label="Nombre" error={errores.nombre}>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={valores.nombre}
          onChange={handleChange}
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby={errores.nombre ? 'nombre-error' : undefined}
        />
      </Campo>

      <Campo id="categoria" label="Categoría" error={errores.categoria}>
        <select
          id="categoria"
          name="categoria"
          value={valores.categoria}
          onChange={handleChange}
          aria-invalid={Boolean(errores.categoria)}
          aria-describedby={errores.categoria ? 'categoria-error' : undefined}
        >
          <option value="">Elegí una categoría</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Campo>

      <Campo id="precio" label="Precio (ARS)" error={errores.precio}>
        <input
          id="precio"
          name="precio"
          type="number"
          min="0"
          step="any"
          value={valores.precio}
          onChange={handleChange}
          aria-invalid={Boolean(errores.precio)}
          aria-describedby={errores.precio ? 'precio-error' : undefined}
        />
      </Campo>

      <Campo id="stock" label="Stock (unidades)" error={errores.stock}>
        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={valores.stock}
          onChange={handleChange}
          aria-invalid={Boolean(errores.stock)}
          aria-describedby={errores.stock ? 'stock-error' : undefined}
        />
      </Campo>

      <Campo id="imagen" label="Imagen (ruta o URL)" error={errores.imagen}>
        <input
          id="imagen"
          name="imagen"
          type="text"
          placeholder="/images/productos/mi-producto.webp"
          value={valores.imagen}
          onChange={handleChange}
          aria-invalid={Boolean(errores.imagen)}
          aria-describedby={errores.imagen ? 'imagen-error' : undefined}
        />
      </Campo>

      <Campo id="descripcion" label="Descripción" error={errores.descripcion}>
        <textarea
          id="descripcion"
          name="descripcion"
          rows="5"
          value={valores.descripcion}
          onChange={handleChange}
          aria-invalid={Boolean(errores.descripcion)}
          aria-describedby={errores.descripcion ? 'descripcion-error' : undefined}
        />
      </Campo>

      <label className="admin-form__check">
        <input
          type="checkbox"
          name="destacado"
          checked={valores.destacado}
          onChange={handleChange}
        />
        Producto destacado (aparece en el inicio)
      </label>

      <fieldset className="admin-form__specs">
        <legend>Especificaciones</legend>

        {valores.specs.map((spec, i) => (
          <div className="admin-form__spec-fila" key={i}>
            <input
              type="text"
              placeholder="Nombre (ej. Medidas)"
              aria-label={`Nombre de la especificación ${i + 1}`}
              value={spec.label}
              onChange={(e) => handleSpecChange(i, 'label', e.target.value)}
            />
            <input
              type="text"
              placeholder="Valor (ej. 180 × 45 × 75 cm)"
              aria-label={`Valor de la especificación ${i + 1}`}
              value={spec.value}
              onChange={(e) => handleSpecChange(i, 'value', e.target.value)}
            />
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => quitarSpec(i)}
              aria-label={`Quitar especificación ${i + 1}`}
            >
              Quitar
            </button>
          </div>
        ))}

        {errores.specs && <p className="admin-form__error">{errores.specs}</p>}

        <button type="button" className="btn btn--secondary" onClick={agregarSpec}>
          Agregar especificación
        </button>
      </fieldset>

      <button type="submit" className="btn btn--primary" disabled={guardando}>
        {guardando ? 'Guardando…' : textoBoton}
      </button>
    </form>
  );
}