import express from 'express';
import { getProductTags } from '../controllers/productTags.controller.js';

const router = express.Router();
router.post('/', getProductTags);
export default router;
