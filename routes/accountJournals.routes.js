import express from 'express';
import { getAccountJournals } from '../controllers/accountJournals.controller.js';

const router = express.Router();

router.post('/', getAccountJournals);

export default router;
