import { odooSearchRead } from './odooClient.js';
import { odooWrite } from './odooClient.js';

export async function getProducts(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const products = await odooSearchRead('product.product', sessionId, {
      args: [],
      kwargs: {
      },
    });
    return res.json({ success: true, products });
  } catch (error) {
    console.error('Get Products Error:', error?.data || error.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: error?.data || error.message,
    });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!id) return res.status(400).json({ message: 'Product ID is required' });
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' });

    const ok = await odooWrite('product.product', sessionId, [Number(id)], values);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Product Error:', error?.data || error.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: error?.data || error.message,
    });
  }
}
