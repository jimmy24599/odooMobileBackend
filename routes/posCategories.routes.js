import express from 'express';
import { getPosCategories } from '../controllers/posCategories.controller.js';

const router = express.Router();
router.post('/', getPosCategories);
export default router;
