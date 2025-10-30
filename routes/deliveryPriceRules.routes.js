import express from 'express'
import { getDeliveryPriceRules, createDeliveryPriceRule, updateDeliveryPriceRule } from '../controllers/deliveryPriceRules.controller.js'

const router = express.Router()

router.post('/', getDeliveryPriceRules)
router.post('/create', createDeliveryPriceRule)
router.put('/:id', updateDeliveryPriceRule)

export default router
