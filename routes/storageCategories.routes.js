import express from 'express';
import { getStorageCategories, createStorageCategory, updateStorageCategory } from '../controllers/storageCategories.controller.js';

const router = express.Router();

// List storage categories (expects { sessionId } in body)
router.post('/', getStorageCategories);

// Create storage category (expects { sessionId, values } in body)
router.post('/create', createStorageCategory);

// Update storage category (expects :id param and { sessionId, values } in body)
router.put('/:id', updateStorageCategory);

export default router;
