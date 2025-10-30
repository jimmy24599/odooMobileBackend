import express from 'express'
import { getQuantPackages, createQuantPackage, updateQuantPackage } from '../controllers/quantPackages.controller.js'

const router = express.Router()

router.post('/', getQuantPackages)
router.post('/create', createQuantPackage)
router.put('/:id', updateQuantPackage)

export default router
