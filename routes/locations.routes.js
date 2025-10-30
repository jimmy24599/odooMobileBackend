import express from 'express';
import { getLocations, updateLocation, createLocation } from '../controllers/locations.controller.js';

const router = express.Router();

router.post('/', getLocations);
// Create location (expects { sessionId, values })
router.post('/create', createLocation);
// Update location (expects :id and { sessionId, values })
router.put('/:id', updateLocation);

export default router;
