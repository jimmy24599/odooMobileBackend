import express from 'express';
import { getWorkcenters } from '../controllers/workcenters.controller.js';

const router = express.Router();

router.post('/', getWorkcenters);

export default router;
