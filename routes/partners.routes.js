import express from 'express';
import { getPartners } from '../controllers/partners.controller.js';

const router = express.Router();

router.post('/', getPartners);

export default router;
