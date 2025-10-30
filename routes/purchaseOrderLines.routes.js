import express from 'express';
import { getPurchaseOrderLinesByProduct, createPurchaseOrderLine, updatePurchaseOrderLine } from '../controllers/purchaseOrderLines.controller.js';

const router = express.Router();

router.post('/by-product', getPurchaseOrderLinesByProduct);
router.post('/create', createPurchaseOrderLine);
router.put('/:id', updatePurchaseOrderLine);

export default router;
