import express from 'express';
import { getPackageTypes } from '../controllers/packageTypes.controller.js';

const router = express.Router();

// Fetch package types
router.post('/', getPackageTypes);

export default router;
