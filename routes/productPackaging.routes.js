import express from 'express';
import { getProductPackaging, createProductPackaging, updateProductPackaging } from '../controllers/productPackaging.controller.js';

const router = express.Router();

router.post('/', getProductPackaging);
router.post('/create', createProductPackaging);
router.put('/:id', updateProductPackaging);

export default router;
