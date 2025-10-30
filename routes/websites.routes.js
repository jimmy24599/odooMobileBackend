import express from 'express';
import { getWebsites } from '../controllers/websites.controller.js';

const router = express.Router();
router.post('/', getWebsites);
export default router;
