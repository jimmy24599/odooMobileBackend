import express from 'express';
import { getStockMoves, getStockMovesByIds, createStockMove, getStockMovesByDomain } from '../controllers/stockMoves.controller.js';

const router = express.Router();

router.post('/', getStockMoves);
router.post('/by-ids', getStockMovesByIds);
router.post('/by-domain', getStockMovesByDomain);
router.post('/create', createStockMove);

export default router;
