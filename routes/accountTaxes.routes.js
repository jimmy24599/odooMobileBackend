import express from 'express';
import { getAccountTaxes } from '../controllers/accountTaxes.controller.js';

const router = express.Router();
router.post('/', getAccountTaxes);
export default router;
