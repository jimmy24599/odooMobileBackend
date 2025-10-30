import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js';

export async function getStockRoutes(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const stockRoutes = await odooSearchRead('stock.route', sessionId);
    return res.json({ success: true, stockRoutes });
  } catch (error) {
    console.error('Get Stock Routes Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createStockRoute(req, res) {
  try {
    const { sessionId, values } = req.body || {};
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values) return res.status(400).json({ message: 'Values are required' });

    const payload = {};
    if (typeof values.name === 'string') payload.name = values.name;
    if (typeof values.product_categ_selectable === 'boolean') payload.product_categ_selectable = values.product_categ_selectable;
    if (typeof values.product_selectable === 'boolean') payload.product_selectable = values.product_selectable;
    if (typeof values.packaging_selectable === 'boolean') payload.packaging_selectable = values.packaging_selectable;
    if (typeof values.shipping_selectable === 'boolean') payload.shipping_selectable = values.shipping_selectable;
    if (typeof values.warehouse_selectable === 'boolean') payload.warehouse_selectable = values.warehouse_selectable;
    if (typeof values.sale_selectable === 'boolean') payload.sale_selectable = values.sale_selectable;
    if (Array.isArray(values.warehouse_ids)) {
      const ids = values.warehouse_ids.map((v) => Number(v)).filter((n) => Number.isFinite(n))
      payload.warehouse_ids = [[6, 0, ids]];
    }

    const id = await odooCreate('stock.route', sessionId, payload);
    return res.json({ success: !!id, id });
  } catch (error) {
    console.error('Create Stock Route Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function updateStockRoute(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body || {};
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const routeId = Number(id);
    if (!routeId) return res.status(400).json({ message: 'Valid route ID is required' });

    const payload = {};
    if (typeof values?.name === 'string') payload.name = values.name;
    if (typeof values?.product_categ_selectable === 'boolean') payload.product_categ_selectable = values.product_categ_selectable;
    if (typeof values?.product_selectable === 'boolean') payload.product_selectable = values.product_selectable;
    if (typeof values?.packaging_selectable === 'boolean') payload.packaging_selectable = values.packaging_selectable;
    if (typeof values?.shipping_selectable === 'boolean') payload.shipping_selectable = values.shipping_selectable;
    if (typeof values?.warehouse_selectable === 'boolean') payload.warehouse_selectable = values.warehouse_selectable;
    if (typeof values?.sale_selectable === 'boolean') payload.sale_selectable = values.sale_selectable;
    if (Array.isArray(values?.warehouse_ids)) {
      const ids = values.warehouse_ids.map((v) => Number(v)).filter((n) => Number.isFinite(n))
      payload.warehouse_ids = [[6, 0, ids]];
    }

    const ok = await odooWrite('stock.route', sessionId, [routeId], payload);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Stock Route Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
