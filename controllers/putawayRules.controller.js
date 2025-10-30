import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js';

// GET list of putaway rules
export async function getPutawayRules(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const rules = await odooSearchRead('stock.putaway.rule', sessionId, {
      args: [],
      kwargs: {
        // No explicit fields: let Odoo return default/readable fields for this server version
        limit: 2000,
      },
    });
    return res.json({ success: true, putawayRules: rules });
    
  } catch (error) {
    console.error('Get Putaway Rules Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

// POST create a new putaway rule
export async function createPutawayRule(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values || (!values.location_in_id && !values.location_out_id)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const payload = {};
    // Optional known fields (v18/19)
    if (Number.isInteger(values.product_id)) payload.product_id = values.product_id;
    if (Number.isInteger(values.product_categ_id)) payload.product_categ_id = values.product_categ_id;
    if (Number.isInteger(values.location_in_id)) payload.location_in_id = values.location_in_id;
    if (Number.isInteger(values.location_out_id)) payload.location_out_id = values.location_out_id;
    if (Number.isInteger(values.storage_category_id)) payload.storage_category_id = values.storage_category_id;
    if (typeof values.sublocation === 'string') payload.sublocation = values.sublocation;
    if (Array.isArray(values.package_type_ids)) payload.package_type_ids = [[6, 0, values.package_type_ids.map(Number).filter(Number.isInteger)]];
    if (Number.isInteger(values.company_id)) payload.company_id = values.company_id;
    if (typeof values.active === 'boolean') payload.active = values.active;
    if (Number.isInteger(values.sequence)) payload.sequence = values.sequence;

    const id = await odooCreate('stock.putaway.rule', sessionId, payload);
    return res.json({ success: true, id });
  } catch (error) {
    console.error('Create Putaway Rule Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

// PUT update an existing putaway rule
export async function updatePutawayRule(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const ruleId = Number(id);
    if (!ruleId || !values) return res.status(400).json({ message: 'Invalid request' });

    const payload = {};
    if (Number.isInteger(values.product_id)) payload.product_id = values.product_id;
    if (Number.isInteger(values.product_categ_id)) payload.product_categ_id = values.product_categ_id;
    if (Number.isInteger(values.location_in_id)) payload.location_in_id = values.location_in_id;
    if (Number.isInteger(values.location_out_id)) payload.location_out_id = values.location_out_id;
    if (Number.isInteger(values.storage_category_id)) payload.storage_category_id = values.storage_category_id;
    if (typeof values.sublocation === 'string') payload.sublocation = values.sublocation;
    if (Array.isArray(values.package_type_ids)) payload.package_type_ids = [[6, 0, values.package_type_ids.map(Number).filter(Number.isInteger)]];
    if (Number.isInteger(values.company_id)) payload.company_id = values.company_id;
    if (typeof values.active === 'boolean') payload.active = values.active;
    if (Number.isInteger(values.sequence)) payload.sequence = values.sequence;

    const ok = await odooWrite('stock.putaway.rule', sessionId, [ruleId], payload);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Putaway Rule Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
