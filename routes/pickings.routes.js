import express from 'express';
import { getPickings, updatePicking, createPicking, validatePicking, printPicking, returnPicking, cancelPicking } from '../controllers/pickings.controller.js';

const router = express.Router();

router.post('/', getPickings);
router.post('/create', createPicking);
router.put('/:id', updatePicking);
router.post('/:id/validate', validatePicking);
router.post('/:id/print', printPicking);
router.post('/:id/return', returnPicking);
router.post('/:id/cancel', cancelPicking);

export default router;
