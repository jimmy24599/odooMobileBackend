import { Router } from 'express'
import { getAttributeValues } from '../controllers/attributeValues.controller.js'

const router = Router()

// POST /api/attribute-values
router.post('/', getAttributeValues)

export default router
