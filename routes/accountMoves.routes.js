import express from 'express';
import { getVendorBills } from '../controllers/accountMoves.controller.js';

const router = express.Router();

router.post('/', getVendorBills);

export default router;
