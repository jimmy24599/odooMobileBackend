import express from 'express'
import { readSettings, writeSettings } from '../controllers/settings.controller.js'

const router = express.Router()

router.get('/', readSettings)
router.post('/', writeSettings)

export default router
