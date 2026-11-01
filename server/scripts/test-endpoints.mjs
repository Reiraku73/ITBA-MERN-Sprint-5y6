// Prueba los 5 endpoints de productos contra una URL (local o Render).
// Uso:  node scripts/test-endpoints.mjs https://TU-SERVICIO.onrender.com
// Crea un producto de prueba y lo borra al final: no deja basura en Atlas.

const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/+$/, '');
const api = `${base}/api/productos`;
let fallos = 0;

async function paso(nombre, fn) {
  try {
    const { ok, detalle } = await fn();
    console.log(`${ok ? '✅' : '❌'} ${nombre}${detalle ? ' — ' + detalle : ''}`);
    if (!ok) fallos++;
  } catch (e) {
    console.log(`❌ ${nombre} — ${e.message}`);
    fallos++;
  }
}

const json = (res) => res.json().catch(() => ({}));
let id;

console.log(`Probando ${base}\n(el primer request puede tardar ~50 s si Render estaba dormido)\n`);

await paso('GET /api/health', async () => {
  const res = await fetch(`${base}/api/health`);
  return { ok: res.status === 200, detalle: `status ${res.status}` };
});

await paso('1) GET /api/productos (listado)', async () => {
  const res = await fetch(api);
  const body = await json(res);
  const n = Array.isArray(body.data) ? body.data.length : 0;
  return { ok: res.status === 200 && n > 0, detalle: `status ${res.status}, ${n} productos` };
});

await paso('2) POST /api/productos (alta)', async () => {
  const res = await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: 'Producto de prueba (borrar)',
      precio: 1000,
      stock: 1,
      categoria: 'prueba',
    }),
  });
  const body = await json(res);
  id = body.data?.id;
  return { ok: res.status === 201 && !!id, detalle: `status ${res.status}, id ${id}` };
});

await paso('3) GET /api/productos/:id (detalle)', async () => {
  const res = await fetch(`${api}/${id}`);
  return { ok: res.status === 200, detalle: `status ${res.status}` };
});

await paso('4) PUT /api/productos/:id (edición)', async () => {
  const res = await fetch(`${api}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ precio: 2000 }),
  });
  const body = await json(res);
  return {
    ok: res.status === 200 && body.data?.precio === 2000,
    detalle: `status ${res.status}, precio ${body.data?.precio}`,
  };
});

await paso('5) DELETE /api/productos/:id (baja)', async () => {
  const res = await fetch(`${api}/${id}`, { method: 'DELETE' });
  return { ok: res.status === 200, detalle: `status ${res.status}` };
});

await paso('Extra: GET con id borrado devuelve 404', async () => {
  const res = await fetch(`${api}/${id}`);
  return { ok: res.status === 404, detalle: `status ${res.status}` };
});

console.log(fallos === 0 ? '\n🎉 Todo OK' : `\n⚠️  ${fallos} prueba(s) fallaron`);
process.exit(fallos === 0 ? 0 : 1);
