import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import { productos } from './data/productos.js';
import dns from 'node:dns';

// Fuerza DNS públicos (Google y Cloudflare) para resolver la URI mongodb+srv://.
// Algunos DNS de routers/proveedores rechazan las consultas SRV que usa Atlas.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const DEFAULT_STOCK = 10;

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  const ops = productos.map(({ id, imagen, ...resto }) => ({
    updateOne: {
      filter: { nombre: resto.nombre },
      update: { $setOnInsert: { ...resto, imagenUrl: imagen, stock: DEFAULT_STOCK } },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(ops);
  console.log(`Insertados: ${result.upsertedCount} | Ya existían: ${productos.length - result.upsertedCount}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});