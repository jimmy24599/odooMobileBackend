import express from 'express';
import { getInventoryLine } from '../controllers/inventoryLines.controller.js';

const router = express.Router();

router.post('/', getInventoryLine);

export default router;
