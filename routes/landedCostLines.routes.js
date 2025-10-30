import express from 'express';
import { getLandedCostLinesByCost, createLandedCostLine } from '../controllers/landedCostLines.controller.js';

const router = express.Router();

router.post('/by-cost', getLandedCostLinesByCost);
router.post('/create', createLandedCostLine);

export default router;
