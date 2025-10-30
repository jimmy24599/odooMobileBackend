import express from 'express';
import { getStockRules, createStockRule, updateStockRule } from '../controllers/stockRules.controller.js';

const router = express.Router();

router.post('/', getStockRules);

// Create a new stock rule
router.post('/create', createStockRule);

// Update existing stock rule by id
router.put('/:id', updateStockRule);

export default router;
