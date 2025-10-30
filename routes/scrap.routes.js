import express from 'express'
import { getScraps, createScrap, updateScrap, validateScrap } from '../controllers/scrap.controller.js'

const router = express.Router()

router.post('/', getScraps)
router.post('/create', createScrap)
router.put('/:id', updateScrap)
router.post('/:id/validate', validateScrap)

export default router
