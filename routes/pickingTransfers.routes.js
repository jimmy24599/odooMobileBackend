import express from 'express'
import { getPickingTransfers, updatePickingTransfer } from '../controllers/pickingTransfer.controller.js'

const router = express.Router()

router.post('/', getPickingTransfers)
router.put('/:id', updatePickingTransfer)

export default router
