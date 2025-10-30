import express from 'express';
import { getCurrencies } from '../controllers/currencies.controller.js';

const router = express.Router();
router.post('/', getCurrencies);
export default router;
