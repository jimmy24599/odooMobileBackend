import express from 'express'
import { getDeliveryCarriers, createDeliveryCarrier, updateDeliveryCarrier } from '../controllers/deliveryCarriers.controller.js'

const router = express.Router()

router.post('/', getDeliveryCarriers)
router.post('/create', createDeliveryCarrier)
router.put('/:id', updateDeliveryCarrier)

export default router
