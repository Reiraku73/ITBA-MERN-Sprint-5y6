# 🪑 Hermanos Jota — E-commerce artesanal

**Proyecto final — Full Stack Developer · ITBA Educación Ejecutiva**  
**Sprint 5 y 6 — Persistencia de datos y CRUD completo**

Aplicación e-commerce para **Hermanos Jota**, una mueblería artesanal argentina. El frontend en **React** consume una **API REST en Express** que guarda los productos en **MongoDB Atlas** mediante **Mongoose**. Los productos se pueden **crear, ver, editar y eliminar** desde la interfaz.

---

## 🌐 Despliegues

| Parte | Plataforma | URL |
| --- | --- | --- |
| **Frontend** | Vercel | (https://itba-mern-sprint-5y6.vercel.app/) |
| **Backend (API)** | Render |  (https://hermanos-jota-api-4fen.onrender.com/api/productos) |
| **Health check** | Render | (https://hermanos-jota-api-4fen.onrender.com/api/health) |

> El backend está en el plan gratuito de Render: si estuvo un rato sin uso, la primera petición puede tardar ~50 segundos mientras el servicio se despierta.

---

## 👥 Equipo

| Integrante | GitHub |
| --- | --- |
| **Orodaz Mateo** | [@Reiraku73](https://github.com/Reiraku73) |
| **Sacca Jurado Maximo Julian** | [@maximosacca](https://github.com/maximosacca) |
| **Martin de Achaval** | [@martindeachaval](https://github.com/martindeachaval) |
| **Tomás Zambrano** | [@tommyrk](https://github.com/tommyrk) |
| **Franco Lugo** | [@RoBeeBot](https://github.com/RoBeeBot) |

---

## 📑 Índice

1. [Arquitectura](#️-arquitectura)
2. [Stack tecnológico](#️-stack-tecnológico)
3. [Backend](#️-backend--server)
4. [Frontend](#️-frontend--client)
5. [Instalación local](#-instalación-local)
6. [Variables de entorno](#-variables-de-entorno)
7. [Probar la API](#-probar-la-api)
8. [Despliegue](#️-despliegue)
9. [Problemas comunes](#-problemas-comunes)
10. [Decisiones de implementación](#-decisiones-de-implementación)

---

# 🏗️ Arquitectura

```text
┌──────────────────────┐   HTTP JSON    ┌──────────────────────┐   Mongoose   ┌──────────────────────┐
│   React Client       │ ─────────────► │   Express API        │ ───────────► │   MongoDB Atlas      │
│   (Vercel)           │ ◄───────────── │   (Render)           │ ◄─────────── │   (Persistencia)     │
│   localhost:5173     │                │   localhost:3000     │              │                      │
└──────────────────────┘                └──────────────────────┘              └──────────────────────┘
```

```text
ITBA-MERN-Sprint-5y6/
├── client/             → Frontend en React + Vite
├── server/             → Backend en Express + Mongoose
├── package.json        → Prettier compartido (formato de código)
├── .prettierrc.json
├── README.md
└── .gitignore
```

---

# 🛠️ Stack tecnológico

| Tecnología | Uso |
| --- | --- |
| **React 18** | Interfaz de usuario |
| **Vite** | Desarrollo y build del frontend |
| **React Router DOM** | Rutas, `useParams` y `useNavigate` |
| **Node.js 20+** | Entorno del servidor |
| **Express 5** | API REST y manejo de rutas |
| **MongoDB Atlas** | Base de datos en la nube |
| **Mongoose** | Esquemas, modelos y validación de datos |
| **dotenv** | Carga de variables de entorno |
| **CORS** | Control de orígenes permitidos |
| **Prettier** | Formato de código consistente en todo el repo |
| **Vercel / Render** | Despliegue de frontend y backend |

---

# ⚙️ Backend — `server/`

## Modelo `Product`

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `nombre` | String | **Obligatorio** |
| `descripcion` | String | Opcional (por defecto `''`) |
| `precio` | Number | **Obligatorio**, no puede ser negativo |
| `stock` | Number | Entero, no puede ser negativo |
| `imagenUrl` | String | Opcional (también acepta el alias `imagen`) |
| `categoria` | String | Opcional |
| `destacado` | Boolean | Por defecto `false` |
| `specs` | Array de `{ label, value }` | Opcional |

Al responder, el `_id` de MongoDB se expone como **`id`** y se ocultan `_id` y `__v`, para que el frontend siga usando `id` sin cambios.

## Endpoints

| Método | Ruta | Descripción | Éxito |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Chequeo de salud del servidor | `200` |
| `GET` | `/api/productos` | Devuelve todos los productos | `200` |
| `GET` | `/api/productos/:id` | Devuelve un producto por su `id` | `200` |
| `POST` | `/api/productos` | Crea un producto | `201` |
| `PUT` | `/api/productos/:id` | Actualiza un producto (solo los campos enviados) | `200` |
| `DELETE` | `/api/productos/:id` | Elimina un producto y devuelve el eliminado | `200` |
| `GET` | `/api/opiniones` | Devuelve las opiniones de clientes | `200` |

## Formato de respuestas

Todas las respuestas de la API tienen la misma forma:

```json
// Éxito
{ "data": { "id": "665f1c...", "nombre": "Sofá Patagonia", "precio": 450000 }, "error": null }

// Error
{ "data": null, "error": { "message": "No hay productos con ese ID", "code": "NOT_FOUND" } }
```

| Código | `error.code` | Cuándo |
| --- | --- | --- |
| `400` | `BAD_REQUEST` | ID con formato inválido, JSON mal formado o body vacío en un `PUT` |
| `404` | `NOT_FOUND` | El producto o la ruta no existen |
| `413` | `PAYLOAD_TOO_LARGE` | El body supera los 100 kb |
| `422` | `VALIDATION_ERROR` | Falla una validación del esquema (campo obligatorio, precio negativo, stock no entero…) |
| `500` | `INTERNAL_ERROR` | Error interno (el detalle queda solo en los logs del servidor) |

## Middlewares

- **CORS** restringido a los orígenes de `CORS_ORIGIN` (en desarrollo, sin la variable, acepta cualquiera)
- `express.json({ limit: '100kb' })` para parsear JSON
- **logger** de cada request
- **notFound** para rutas inexistentes
- **errorHandler** centralizado: traduce errores de Mongoose y de parseo a respuestas claras en español

## Estructura del backend

```text
server/
├── package.json
├── .env.example
├── scripts/
│   └── test-endpoints.mjs   → prueba automática de los 5 endpoints (local o Render)
└── src/
    ├── server.js            → conexión a MongoDB y arranque del servidor
    ├── app.js               → configuración de Express, CORS y rutas
    ├── seed.js              → carga inicial de productos en MongoDB
    ├── models/
    │   └── Product.js
    ├── controllers/
    │   ├── productController.js
    │   └── opinionsController.js
    ├── routes/
    │   ├── products.js
    │   └── opinions.js
    ├── middleware/
    │   ├── logger.js
    │   ├── notFound.js
    │   └── errorHandler.js
    └── data/
        ├── productos.js     → datos originales (los usa el seed)
        └── opiniones.js
```

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Levanta el servidor con nodemon (recarga al guardar) |
| `npm start` | Levanta el servidor en modo producción (lo usa Render) |
| `npm run seed` | Carga los productos iniciales en MongoDB (no duplica si se repite) |

---

# ⚛️ Frontend — `client/`

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Inicio |
| `/productos` | Catálogo |
| `/productos/:id` | Detalle de producto (`useParams`) |
| `/contacto` | Formulario de contacto |
| `/carrito` | Carrito de compras |
| `/login` · `/register` · `/cuenta` | Usuario |
| `/terminos` · `/privacidad` · `/cambios-devoluciones` | Páginas legales |
| **`/admin/productos`** | Listado de administración: buscar, editar y eliminar |
| **`/admin/crear-producto`** | Alta de producto |
| **`/admin/editar-producto/:id`** | Edición de producto (`useParams`) |

## Administración de productos

- **Crear:** formulario controlado. Al guardar, `useNavigate` lleva al detalle del producto nuevo.
- **Editar:** carga el producto por `id`, rellena el formulario y al guardar vuelve al listado.
- **Eliminar:** desde el listado, con confirmación antes de borrar. El producto desaparece de la lista sin recargar.
- **Validación en el formulario** antes de enviar:
  - nombre de al menos 3 caracteres
  - categoría obligatoria
  - precio mayor a 0
  - stock entero, 0 o mayor
  - imagen que empiece con `/` o `http(s)://`
  - descripción de al menos 20 caracteres
  - especificaciones completas (nombre y valor)
- Los **errores que devuelve la API** también se muestran en el formulario.

## Otras funcionalidades

- Catálogo, detalle, destacados y carruseles cargados desde MongoDB
- Carrito de compras con contexto de React (`CartProvider`) y persistencia en `localStorage`
- Login, registro y cuenta de usuario (sesión local)
- Formulario de contacto, opiniones y páginas legales
- Estados de carga, error y reintento en las pantallas que consultan la API

## Capa de servicios

- [`services/api.js`](client/src/services/api.js): cliente HTTP único. Maneja el timeout, el parseo de respuestas, el formato `{ data, error }` y la traducción de errores a mensajes para el usuario.
- [`services/productService.js`](client/src/services/productService.js): `getProductos`, `getProductoById`, `crearProducto`, `actualizarProducto` y `eliminarProducto`.

## Estructura del frontend

```text
client/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json              → redirige todas las rutas a index.html (React Router)
├── .env.example
├── public/
│   ├── icons/
│   └── images/
└── src/
    ├── App.jsx              → definición de rutas
    ├── main.jsx
    ├── components/
    │   ├── admin/           → ProductoForm (alta y edición)
    │   ├── cart/
    │   ├── contact/
    │   ├── home/
    │   ├── layout/
    │   ├── products/
    │   └── ui/
    ├── context/             → CartContext y CartProvider
    ├── hooks/               → useProductos, useApiQuery, useAuth, useCart…
    ├── pages/
    │   ├── admin/           → ProductosAdmin, CrearProducto, EditarProducto
    │   └── …                → Home, Productos, Producto, Carrito, Contacto…
    ├── services/            → api.js, productService.js, opinionService.js
    ├── styles/
    └── utils/
```

---

# 🚀 Instalación local

## Requisitos

- [Node.js](https://nodejs.org/) **20 o superior**
- [npm](https://www.npmjs.com/) y [Git](https://git-scm.com/)
- Acceso a un cluster de [MongoDB Atlas](https://www.mongodb.com/atlas) (con tu IP habilitada en **Network Access**)

## 1. Clonar el repositorio

```bash
git clone https://github.com/Reiraku73/ITBA-MERN-Sprint-5y6.git
cd ITBA-MERN-Sprint-5y6
```

## 2. Backend

```bash
cd server
npm install
```

Crear `server/.env` a partir de `server/.env.example` (ver [Variables de entorno](#-variables-de-entorno)):

```env
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/NOMBRE_DB?retryWrites=true&w=majority
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

Cargar los productos iniciales y levantar el servidor:

```bash
npm run seed
npm run dev
```

Si todo salió bien, la consola muestra:

```text
Conectado a MongoDB (base : NOMBRE_DB)
Servidor escuchando en puerto: 3000
```

## 3. Frontend

En otra terminal, desde la raíz del proyecto:

```bash
cd client
npm install
```

Crear `client/.env` a partir de `client/.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

Levantar la app:

```bash
npm run dev
```

La aplicación queda disponible en **http://localhost:5173**.

> ⚠️ El backend tiene que estar corriendo para que el frontend pueda cargar los productos.

---

# 🔐 Variables de entorno

Los archivos `.env` **no se suben al repositorio** (están en `.gitignore`). Solo se versionan los `.env.example`, sin credenciales reales.

## Backend — `server/.env`

| Variable | Obligatoria | Descripción | Ejemplo |
| --- | --- | --- | --- |
| `MONGODB_URI` | ✅ | URI de conexión a MongoDB Atlas | `mongodb+srv://...` |
| `PORT` | — | Puerto del servidor (en Render lo asigna la plataforma) | `3000` |
| `CORS_ORIGIN` | En producción | Orígenes del frontend permitidos, separados por coma | `http://localhost:5173,https://...vercel.app` |
| `NODE_ENV` | En producción | En `production` se usa el DNS de la plataforma (ver [Problemas comunes](#-problemas-comunes)) | `production` |

## Frontend — `client/.env`

| Variable | Obligatoria | Descripción | Ejemplo |
| --- | --- | --- | --- |
| `VITE_API_URL` | ✅ | URL base de la API, **terminada en `/api`** | `http://localhost:3000/api` |

---

# 🧪 Probar la API

## Prueba automática

El script recorre los 5 endpoints. Crea un producto de prueba, lo edita y lo borra, así que no deja datos basura en la base:

```bash
cd server

# Contra el servidor local
node scripts/test-endpoints.mjs

# Contra el despliegue en Render
node scripts/test-endpoints.mjs https://hermanos-jota-api-4fen.onrender.com
```

## Prueba manual (Thunder Client / Postman)

```http
GET    http://localhost:3000/api/productos
GET    http://localhost:3000/api/productos/<id>
POST   http://localhost:3000/api/productos
PUT    http://localhost:3000/api/productos/<id>
DELETE http://localhost:3000/api/productos/<id>
```

Body de ejemplo para `POST` / `PUT` (JSON):

```json
{
  "nombre": "Mesa Ratona Delta",
  "descripcion": "Mesa ratona de madera maciza con terminación natural.",
  "precio": 180000,
  "stock": 4,
  "categoria": "Living",
  "imagenUrl": "/images/productos/mesa-de-centro-araucaria.webp"
}
```

Casos de error a verificar:

| Caso | Resultado esperado |
| --- | --- |
| `POST` sin `nombre` o sin `precio` | `422` |
| `precio` negativo o `stock` con decimales | `422` |
| `PUT` con body vacío (`{}`) | `400` |
| ID con formato inválido (ej. `abc`) | `400` |
| ID con formato válido pero inexistente | `404` |

---

# ☁️ Despliegue

## Backend en Render

1. **New → Web Service** y conectar el repositorio.
2. **Root Directory:** `server`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Environment:** cargar `MONGODB_URI`, `CORS_ORIGIN` (con la URL de Vercel) y `NODE_ENV=production`.
6. En MongoDB Atlas → **Network Access**, permitir `0.0.0.0/0` para que Render pueda conectarse.
7. Verificar en `https://<servicio>.onrender.com/api/health`.

## Frontend en Vercel

1. Importar el repositorio y elegir `client` como **Root Directory** (framework: Vite).
2. **Build Command:** `npm run build` · **Output Directory:** `dist`
3. Agregar la variable `VITE_API_URL` con la URL de Render **terminada en `/api`**.
4. `vercel.json` ya redirige todas las rutas a `index.html`, así que recargar `/productos/:id` o `/admin/...` funciona sin dar 404.

> Si cambia la URL del frontend, hay que actualizar `CORS_ORIGIN` en Render. Si cambia la del backend, hay que actualizar `VITE_API_URL` en Vercel y volver a desplegar.

---

# 🧯 Problemas comunes

| Error | Causa | Solución |
| --- | --- | --- |
| `querySrv ECONNREFUSED` | El DNS de la red no resuelve la URI `mongodb+srv://` | El servidor y el seed ya fuerzan DNS públicos (`8.8.8.8` / `1.1.1.1`) fuera de producción. Si persiste, cambiar el DNS del sistema |
| `Server selection timed out` | La IP no está habilitada en Atlas | Agregarla en **Network Access** |
| `bad auth : authentication failed` | Usuario o contraseña incorrectos | Revisar `MONGODB_URI` |
| El frontend muestra error de conexión | Backend apagado o `VITE_API_URL` mal configurada | Verificar que la URL termine en `/api` y que el puerto coincida |
| Error de CORS en el navegador | El origen del frontend no está en `CORS_ORIGIN` | Agregarlo (sin `/` al final) |

---

# 🧭 Decisiones de implementación

- **Dos proyectos separados** (`client/` y `server/`), con dependencias, scripts y despliegues independientes.
- **`_id` expuesto como `id`:** el modelo transforma la respuesta, así que el frontend no tuvo que cambiar cómo identifica productos.
- **Respuesta uniforme `{ data, error }`:** el cliente HTTP del frontend la interpreta en un solo lugar.
- **Validación en dos capas:** el formulario valida antes de enviar (mejor UX) y el esquema de Mongoose es la fuente de verdad. El `errorHandler` traduce sus errores a `422` con mensajes en español.
- **PUT con `set()` + `save()`:** actualiza solo los campos enviados y ejecuta todas las validaciones del esquema. No se pueden pisar `_id`, `id` ni `__v`.
- **Express 5:** los errores de los controladores `async` llegan solos al manejador central, sin `try/catch` en cada controlador.
- **Conexión antes de escuchar:** el servidor solo acepta requests si la conexión a MongoDB fue exitosa. Si falla, muestra el error y termina.
- **Seed idempotente:** `npm run seed` usa `upsert` por nombre, así que se puede correr varias veces sin duplicar productos.
- **CORS por variable de entorno:** los orígenes permitidos se configuran sin tocar código.
- **Prettier compartido** en la raíz (`npm run format`), para mantener el mismo estilo en todo el repo.

---

# 📚 Estado del proyecto

- [x] Backend Express conectado a MongoDB Atlas
- [x] Modelo `Product` con validaciones
- [x] CRUD completo (`GET`, `POST`, `PUT`, `DELETE`)
- [x] Manejo de errores consistente
- [x] Catálogo y detalle leyendo desde la base de datos
- [x] Alta, edición y eliminación desde la interfaz
- [x] Frontend desplegado en Vercel y backend en Render

## Mejoras futuras

- Autenticación real con JWT y contraseñas hasheadas
- Proteger las rutas `/admin` para que solo accedan administradores
- Persistir usuarios, carritos y pedidos en la base de datos
- Paginación y filtros del lado del servidor
- Subida de imágenes (en lugar de ingresar la ruta o URL)

---

*Proyecto desarrollado en el marco del curso Full Stack Developer — ITBA Educación Ejecutiva.*
