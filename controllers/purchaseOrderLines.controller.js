import { odooSearchRead, odooCreate, odooWrite } from '../controllers/odooClient.js';

export async function getPurchaseOrderLinesByProduct(req, res) {
  try {
    const { sessionId, product_id, fields = [] } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!product_id) return res.status(400).json({ message: 'product_id is required' });
    const kwargs = {};
    if (Array.isArray(fields) && fields.length) kwargs.fields = fields;
    const lines = await odooSearchRead('purchase.order.line', sessionId, {
      args: [[['product_id', '=', Number(product_id)]]],
      kwargs,
    });
    return res.json({ success: true, lines });
  } catch (error) {
    console.error('Get POL by product error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createPurchaseOrderLine(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values || !values.product_id || !values.partner_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const payload = {
      product_id: Number(values.product_id),
      partner_id: Number(values.partner_id),
      product_qty: Number(values.product_qty || 0),
      price_unit: Number(values.price_unit || 0),
      currency_id: values.currency_id ? Number(values.currency_id) : false,
    };
    const id = await odooCreate('purchase.order.line', sessionId, payload);
    return res.json({ success: true, id });
  } catch (error) {
    console.error('Create POL error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function updatePurchaseOrderLine(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const lineId = Number(id);
    if (!lineId) return res.status(400).json({ message: 'Invalid ID' });
    const payload = {};
    if (values) {
      if (values.product_id != null) payload.product_id = Number(values.product_id);
      if (values.partner_id != null) payload.partner_id = Number(values.partner_id);
      if (values.product_qty != null) payload.product_qty = Number(values.product_qty);
      if (values.price_unit != null) payload.price_unit = Number(values.price_unit);
      if (values.currency_id != null) payload.currency_id = values.currency_id ? Number(values.currency_id) : false;
    }
    const ok = await odooWrite('purchase.order.line', sessionId, [lineId], payload);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update POL error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
