import express from 'express'
import { getRepairTags } from '../controllers/repairTags.controller.js'

const router = express.Router()
router.post('/', getRepairTags)
export default router
