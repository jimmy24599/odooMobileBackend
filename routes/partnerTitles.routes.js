import express from 'express';
import { getPartnerTitles } from '../controllers/partnerTitles.controller.js';

const router = express.Router();

router.post('/', getPartnerTitles);

export default router;
