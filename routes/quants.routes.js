import express from 'express';
import { getQuants } from '../controllers/quants.controller.js';

const router = express.Router();

router.post('/', getQuants);

export default router;
