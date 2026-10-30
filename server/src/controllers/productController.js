import Product from '../models/Product.js';
import { ApiError } from '../middleware/errorHandler.js';

// Campos que el cliente NO puede modificar en un PUT
const CAMPOS_PROTEGIDOS = ['_id', 'id', '__v'];

// GET /api/productos
// Devuelve todos los productos guardados en MongoDB
export async function getProductos(req, res) {
  const productosDB = await Product.find();

  res.status(200).json({ data: productosDB, error: null });
}

// PUT /api/productos/:id
export async function updateProducto(req, res) {
  const { id } = req.params;
  const cambios = req.body;

  if (!cambios || typeof cambios !== 'object' || Object.keys(cambios).length === 0) {
    throw new ApiError(400, 'Enviá al menos un campo para actualizar.');
  }

  for (const campo of CAMPOS_PROTEGIDOS) {
    delete cambios[campo];
  }

  const producto = await Product.findById(id);
  if (!producto) throw new ApiError(404, 'No hay productos con ese ID');

  producto.set(cambios);
  const productoActualizado = await producto.save();

  res.status(200).json({ data: productoActualizado, error: null });
}

// DELETE /api/productos/:id
// Elimina un producto y devuelve el producto borrado
export async function deleteProducto(req, res) {
  const { id } = req.params;

  const productoEliminado = await Product.findByIdAndDelete(id);
  if (!productoEliminado) throw new ApiError(404, 'No hay productos con ese ID');

  res.status(200).json({ data: productoEliminado, error: null });
}