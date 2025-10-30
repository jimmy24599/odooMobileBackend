import { odooSearchRead } from './odooClient.js';
import { odooWrite } from './odooClient.js';
import { odooFieldsGet } from './odooClient.js';

export async function getProductTemplates(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    try {
      const fieldsMeta = await odooFieldsGet('product.template', sessionId);
    } catch (e) {
      console.error('FieldsGet product.template error:', e?.data || e.message);
    }

    const productTemplates = await odooSearchRead('product.template', sessionId);
    return res.json({ success: true, productTemplates });
  } catch (error) {
    console.error('Get Product Templates Error:', error?.data || error.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: error?.data || error.message,
    });
  }
}

export async function updateProductTemplate(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!id) return res.status(400).json({ message: 'Template ID is required' });
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' });

    const ok = await odooWrite('product.template', sessionId, [Number(id)], values);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Product Template Error:', error?.data || error.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: error?.data || error.message,
    });
  }
}
