import express from 'express';
import { getUom, createUom, updateUom } from '../controllers/uom.controller.js';

const router = express.Router();

router.post('/', getUom);
router.post('/create', createUom);
router.put('/:id', updateUom);

export default router;
