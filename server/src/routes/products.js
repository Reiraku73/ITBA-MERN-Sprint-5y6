import { Router } from 'express';
import {
  getProductos,
  updateProducto,
  deleteProducto,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProductos);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

export default router;