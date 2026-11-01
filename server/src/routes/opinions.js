import { Router } from 'express';
import { getOpiniones } from '../controllers/opinionsController.js';

const router = Router();

router.get('/', getOpiniones);

export default router;
