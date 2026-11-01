import 'dotenv/config.js'
import app from './app.js'
import mongoose from 'mongoose'
import dns from 'node:dns';

// Fuerza DNS públicos (Google y Cloudflare) para resolver la URI mongodb+srv://.
// Algunos DNS de routers/proveedores rechazan las consultas SRV que usa Atlas.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const PORT = process.env.PORT || 3001 

async function connectDB() {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI no está definido en las variables de entorno.')
    await mongoose.connect(uri)
    console.log(`Conectado a MongoDB (base : ${mongoose.connection.name})`)
}

async function start() {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en puerto: ${PORT}`)
        })
    } catch (error) {
        console.log('Error al conectar con MongoDB', error.message)
        process.exit(1)
    }
}

start()