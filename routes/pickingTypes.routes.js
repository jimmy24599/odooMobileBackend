import express from 'express';
import { getStockPickingTypes, createStockPickingType, updateStockPickingType } from '../controllers/pickingTypes.controller.js';

const router = express.Router();

router.post('/', getStockPickingTypes);

// Create new picking type
router.post('/create', createStockPickingType);

// Update existing picking type by id
router.put('/:id', updateStockPickingType);

export default router;
