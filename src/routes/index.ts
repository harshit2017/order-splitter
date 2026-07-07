import { Router } from 'express';
import { modelController } from '../controllers/model.controller';
import { ordersController } from '../controllers/orders.controller';

const router = Router();

router.post('/model', (req, res, next) => modelController.create(req, res, next));
router.get('/orders', (req, res, next) => ordersController.list(req, res, next));

export default router;
