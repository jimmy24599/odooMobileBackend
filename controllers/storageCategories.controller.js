import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js';

// GET list of storage categories
export async function getStorageCategories(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const storageCategories = await odooSearchRead('stock.storage.category', sessionId, {
      args: [],
      // Leave fields empty to fetch all available fields; keep a soft limit
      kwargs: { limit: 2000 },
    });

    return res.json({ success: true, storageCategories });
  } catch (error) {
    console.error('Get Storage Categories Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

// POST create a new storage category
export async function createStorageCategory(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values || !values.name) return res.status(400).json({ message: 'Missing required fields' });

    const payload = {};
    if (typeof values.name === 'string') payload.name = values.name;
    if (typeof values.active === 'boolean') payload.active = values.active;
    // selection value like 'mixed' | 'same' | 'no' (varies by Odoo version). Pass through if provided
    if (typeof values.allow_new_product === 'string') payload.allow_new_product = values.allow_new_product;
    if (typeof values.allow_new_products === 'string') payload.allow_new_products = values.allow_new_products;
    if (Number.isFinite(values.max_weight)) payload.max_weight = values.max_weight;
    if (Number.isFinite(values.max_weight_kg)) payload.max_weight_kg = values.max_weight_kg;
    if (typeof values.barcode === 'string') payload.barcode = values.barcode;
    // Allow capacity one2many create commands from UI
    if (Array.isArray(values.package_capacity_ids)) payload.package_capacity_ids = values.package_capacity_ids;
    if (Array.isArray(values.product_capacity_ids)) payload.product_capacity_ids = values.product_capacity_ids;
    if (Number.isInteger(values.company_id)) payload.company_id = values.company_id;

    const id = await odooCreate('stock.storage.category', sessionId, payload);
    return res.json({ success: true, id });
  } catch (error) {
    console.error('Create Storage Category Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

// PUT update an existing storage category
export async function updateStorageCategory(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const recId = Number(id);
    if (!recId || !values) return res.status(400).json({ message: 'Invalid request' });

    const payload = {};
    if (typeof values.name === 'string') payload.name = values.name;
    if (typeof values.active === 'boolean') payload.active = values.active;
    if (typeof values.allow_new_product === 'string') payload.allow_new_product = values.allow_new_product;
    if (typeof values.allow_new_products === 'string') payload.allow_new_products = values.allow_new_products;
    if (Number.isFinite(values.max_weight)) payload.max_weight = values.max_weight;
    if (Number.isFinite(values.max_weight_kg)) payload.max_weight_kg = values.max_weight_kg;
    if (typeof values.barcode === 'string') payload.barcode = values.barcode;
    // Forward one2many commands if provided
    if (Array.isArray(values.package_capacity_ids)) payload.package_capacity_ids = values.package_capacity_ids;
    if (Array.isArray(values.product_capacity_ids)) payload.product_capacity_ids = values.product_capacity_ids;
    if (Number.isInteger(values.company_id)) payload.company_id = values.company_id;

    const ok = await odooWrite('stock.storage.category', sessionId, [recId], payload);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Storage Category Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
