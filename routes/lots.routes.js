import express from 'express';
import { getLots, createLot, updateLot } from '../controllers/lots.controller.js';

const router = express.Router();

router.post('/', getLots);
router.post('/create', createLot);
router.put('/:id', updateLot);

export default router;
