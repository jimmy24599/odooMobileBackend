import express from 'express';
import { getCategories, createCategory, updateCategory } from '../controllers/categories.controller.js';

const router = express.Router();

router.post('/', getCategories);
router.post('/create', createCategory);
router.put('/:id', updateCategory);

export default router;
