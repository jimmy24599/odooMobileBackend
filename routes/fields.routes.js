import express from 'express'
import { getModelFields } from '../controllers/fields.controller.js'

const router = express.Router()

router.post('/', getModelFields)

export default router
