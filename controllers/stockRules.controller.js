import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js';

export async function getStockRules(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const stockRules = await odooSearchRead('stock.rule', sessionId, { args: [[]], kwargs: { } });
    return res.json({ success: true, stockRules });
  } catch (error) {
    console.error('Get Stock Rules Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createStockRule(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values) return res.status(400).json({ message: 'Values are required' });

    const payload = {};
    if (typeof values.name === 'string') payload.name = values.name;
    if (typeof values.action === 'string') payload.action = values.action;
    if (Number.isInteger(values.picking_type_id)) payload.picking_type_id = values.picking_type_id;
    if (Number.isInteger(values.location_src_id)) payload.location_src_id = values.location_src_id;
    if (Number.isInteger(values.location_dest_id)) payload.location_dest_id = values.location_dest_id;
    if (typeof values.procure_method === 'string') payload.procure_method = values.procure_method;
    if (typeof values.auto === 'string') payload.auto = values.auto;
    if (Number.isInteger(values.route_id)) payload.route_id = values.route_id;
    if (typeof values.group_propagation_option === 'string') payload.group_propagation_option = values.group_propagation_option;
    if (typeof values.propagate_carrier === 'boolean') payload.propagate_carrier = values.propagate_carrier;
    if (Number.isFinite(values.delay)) payload.delay = Number(values.delay);


    const id = await odooCreate('stock.rule', sessionId, payload);
    return res.json({ success: true, id });
  } catch (error) {
    console.error('Create Stock Rule Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function updateStockRule(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const ruleId = Number(id);
    if (!ruleId || !values) return res.status(400).json({ message: 'Invalid request' });

    const payload = {};
    if (typeof values.name === 'string') payload.name = values.name;
    if (typeof values.action === 'string') payload.action = values.action;
    if (Number.isInteger(values.picking_type_id)) payload.picking_type_id = values.picking_type_id;
    if (Number.isInteger(values.location_src_id)) payload.location_src_id = values.location_src_id;
    if (Number.isInteger(values.location_dest_id)) payload.location_dest_id = values.location_dest_id;
    if (typeof values.procure_method === 'string') payload.procure_method = values.procure_method;
    if (typeof values.auto === 'string') payload.auto = values.auto;
    if (Number.isInteger(values.route_id)) payload.route_id = values.route_id;
    if (typeof values.group_propagation_option === 'string') payload.group_propagation_option = values.group_propagation_option;
    if (typeof values.propagate_carrier === 'boolean') payload.propagate_carrier = values.propagate_carrier;
    if (Number.isFinite(values.delay)) payload.delay = Number(values.delay);


    const ok = await odooWrite('stock.rule', sessionId, [ruleId], payload);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Stock Rule Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
