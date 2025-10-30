import { Router } from 'express'
import { getTemplateAttributeLines } from '../controllers/attributeLines.controller.js'

const router = Router()

// POST /api/attribute-lines
router.post('/', getTemplateAttributeLines)

export default router
