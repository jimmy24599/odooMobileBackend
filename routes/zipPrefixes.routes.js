import express from 'express'
import { getZipPrefixes } from '../controllers/zipPrefixes.controller.js'

const router = express.Router()
router.post('/', getZipPrefixes)
export default router
