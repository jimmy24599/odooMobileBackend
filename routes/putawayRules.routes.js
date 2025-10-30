import express from 'express';
import { getPutawayRules, createPutawayRule, updatePutawayRule } from '../controllers/putawayRules.controller.js';

const router = express.Router();

// List rules (expects { sessionId } in body)
router.post('/', getPutawayRules);

// Create rule (expects { sessionId, values } in body)
router.post('/create', createPutawayRule);

// Update rule (expects :id param and { sessionId, values } in body)
router.put('/:id', updatePutawayRule);

export default router;
