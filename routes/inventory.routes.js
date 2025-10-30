import express from 'express';
import { getInventory } from '../controllers/inventory.controller.js';

const router = express.Router();

router.post('/', getInventory);

export default router;
