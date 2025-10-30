import express from 'express'
import { getRepairs, createRepair } from '../controllers/repairs.controller.js'

const router = express.Router()
router.post('/', getRepairs)
router.post('/create', createRepair)
export default router
