import { Router } from 'express';
import {
  getProductos,
  updateProducto,
  deleteProducto,
  getProductoById,
  createProducto,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

export default router;
