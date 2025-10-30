import express from 'express';
import { getProducts, updateProduct } from '../controllers/products.controller.js';
import { odooSearchRead } from '../controllers/odooClient.js';

const router = express.Router();

router.post('/', getProducts);
router.put('/:id', updateProduct);

// Fetch single product by id
router.post('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const result = await odooSearchRead('product.product', sessionId, {
      args: [[['id', '=', Number(id)]]],
      kwargs: { fields: ['id', 'name', 'product_tmpl_id', 'tracking'] },
    });
    return res.json({ success: true, products: Array.isArray(result) ? result : [] });
  } catch (error) {
    console.error('Get Product By Id Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
});

export default router;
