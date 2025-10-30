import express from 'express';
import { getModels } from '../controllers/models.js';

const router = express.Router();

router.post('/getModels', getModels);

export default router;