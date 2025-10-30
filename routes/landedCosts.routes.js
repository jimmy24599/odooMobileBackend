import express from 'express';
import { getLandedCosts, getLandedCostById, createLandedCost, updateLandedCost } from '../controllers/landedCosts.controller.js';

const router = express.Router();

router.post('/', getLandedCosts);
router.post('/:id', getLandedCostById);
router.post('/create', createLandedCost);
router.put('/:id', updateLandedCost);

export default router;
