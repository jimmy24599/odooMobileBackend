import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js';

export async function getProductPackaging(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const productPackaging = await odooSearchRead('product.packaging', sessionId);
    return res.json({ success: true, productPackaging });
  } catch (error) {
    console.error('Get Product Packaging Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

// Create a new product.packaging
export async function createProductPackaging(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values) return res.status(400).json({ message: 'Missing values' });

    const payload = {};
    if (typeof values.name === 'string') payload.name = values.name;
    if (Number.isInteger(values.product_id)) payload.product_id = values.product_id;
    if (Number.isInteger(values.product_tmpl_id)) payload.product_tmpl_id = values.product_tmpl_id;
    if (Number.isInteger(values.package_type_id)) payload.package_type_id = values.package_type_id;
    if (typeof values.purchase === 'boolean') payload.purchase = values.purchase;
    if (typeof values.sales === 'boolean') payload.sales = values.sales;
    if (Array.isArray(values.route_ids)) payload.route_ids = [[6, 0, values.route_ids.map(Number).filter(Number.isInteger)]];
    if (typeof values.qty === 'number') payload.qty = values.qty;
    if (typeof values.barcode === 'string') payload.barcode = values.barcode;

    const id = await odooCreate('product.packaging', sessionId, payload);
    return res.json({ success: true, id });
  } catch (error) {
    console.error('Create Product Packaging Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

// Update an existing product.packaging
export async function updateProductPackaging(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const recId = Number(id);
    if (!recId || !values) return res.status(400).json({ message: 'Invalid request' });

    const payload = {};
    if (typeof values.name === 'string') payload.name = values.name;
    if (Number.isInteger(values.product_id)) payload.product_id = values.product_id;
    if (Number.isInteger(values.product_tmpl_id)) payload.product_tmpl_id = values.product_tmpl_id;
    if (Number.isInteger(values.package_type_id)) payload.package_type_id = values.package_type_id;
    if (typeof values.purchase === 'boolean') payload.purchase = values.purchase;
    if (typeof values.sales === 'boolean') payload.sales = values.sales;
    if (Array.isArray(values.route_ids)) payload.route_ids = [[6, 0, values.route_ids.map(Number).filter(Number.isInteger)]];
    if (typeof values.qty === 'number') payload.qty = values.qty;
    if (typeof values.barcode === 'string') payload.barcode = values.barcode;

    const ok = await odooWrite('product.packaging', sessionId, [recId], payload);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Product Packaging Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
