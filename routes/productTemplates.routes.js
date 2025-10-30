import express from 'express';
import { getProductTemplates, updateProductTemplate } from '../controllers/productTemplates.controller.js';
import { odooSearchRead } from '../controllers/odooClient.js';

const router = express.Router();

router.post('/', getProductTemplates);
// Fetch single template by id
router.post('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const result = await odooSearchRead('product.template', sessionId, {
      args: [[['id', '=', Number(id)]]],
      kwargs: {
        fields: [
          'invoice_policy',
          'list_price',
          'standard_price',
          'categ_id',
          'taxes_id',
          'supplier_taxes_id',
          'tracking',
          'description',
          'optional_product_ids',
          'accessory_product_ids',
          'alternative_product_ids',
        ],
      },
    });
    return res.json({ success: true, template: Array.isArray(result) ? result[0] : null });
  } catch (error) {
    console.error('Get Product Template By Id Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
});

// Update template
router.put('/:id', updateProductTemplate);

export default router;
