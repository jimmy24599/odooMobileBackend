import express from 'express';
import { getAccounts } from '../controllers/accounts.controller.js';

const router = express.Router();

router.post('/', getAccounts);

export default router;
