import express from 'express';
import { getStockMoveLines, getStockMoveLinesByPicking, createStockMoveLine } from '../controllers/moveLines.controller.js';

const router = express.Router();

router.post('/', getStockMoveLines);
router.post('/by-picking', getStockMoveLinesByPicking);
router.post('/create', createStockMoveLine);

export default router;
