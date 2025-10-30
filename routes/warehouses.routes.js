import express from 'express';
import { getWarehouses, createWarehouse, updateWarehouse } from '../controllers/warehouses.controller.js';

const router = express.Router();

router.post('/', getWarehouses);
router.post('/create', createWarehouse);
router.put('/:id', updateWarehouse);

export default router;
