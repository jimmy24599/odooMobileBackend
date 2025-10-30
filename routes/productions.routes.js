import express from 'express';
import { getProductions, createProduction, updateProduction } from '../controllers/productions.controller.js';

const router = express.Router();

router.post('/', getProductions);
router.post('/create', createProduction);
router.put('/:id', updateProduction);

export default router;
