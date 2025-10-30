import express from 'express';
import { getStockRoutes, createStockRoute, updateStockRoute } from '../controllers/stockRoutes.controller.js';

const router = express.Router();

router.post('/', getStockRoutes);
router.post('/create', createStockRoute);
router.put('/:id', updateStockRoute);

export default router;
