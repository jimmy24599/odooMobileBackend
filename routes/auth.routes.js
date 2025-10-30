import express from 'express';
import { signIn, getSession } from '../controllers/auth.js';

const router = express.Router();

router.post('/signin', signIn);
router.post('/session', getSession);

export default router;