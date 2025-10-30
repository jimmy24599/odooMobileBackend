import { Router } from 'express'
import { listSupplierinfo, createSupplierinfo, updateSupplierinfo } from '../controllers/supplierinfo.controller.js'

const router = Router()

// List supplierinfo, optional filter by product_tmpl_id in body
router.post('/', listSupplierinfo)

// Create supplierinfo
router.post('/create', createSupplierinfo)

// Update supplierinfo
router.put('/:id', updateSupplierinfo)

export default router
