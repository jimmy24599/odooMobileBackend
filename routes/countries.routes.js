import express from 'express';
import { getCountries } from '../controllers/countries.controller.js';

const router = express.Router();
router.post('/', getCountries);
export default router;
