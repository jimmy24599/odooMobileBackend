import express from 'express';
import { getRemovalStrategies } from '../controllers/removalStrategies.controller.js';

const router = express.Router();

// POST because the rest of the API expects sessionId in the body
router.post('/', getRemovalStrategies);

export default router;
