import { Router } from 'express'
import { getAttributes } from '../controllers/attributes.controller.js'

const router = Router()

// POST /api/attributes
router.post('/', getAttributes)

export default router
