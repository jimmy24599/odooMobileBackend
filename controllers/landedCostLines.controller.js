import { odooSearchRead, odooCreate } from './odooClient.js';

export async function getLandedCostLinesByCost(req, res) {
  try {
    const { sessionId, cost_id } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const costIdNum = Number(cost_id);
    if (!costIdNum) return res.status(400).json({ message: 'Valid cost_id is required' });

    const lines = await odooSearchRead('stock.landed.cost.lines', sessionId, {
      args: [[['cost_id', '=', costIdNum]]],
      kwargs: {},
    });
    return res.json({ success: true, lines });
  } catch (error) {
    console.error('Get Landed Cost Lines Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createLandedCostLine(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values) return res.status(400).json({ message: 'Values are required' });

    const cost_id = Number(values.cost_id);
    if (!cost_id) return res.status(400).json({ message: 'Valid cost_id is required' });

    const payload = {
      cost_id,
      product_id: Number(values.product_id) || false,
      name: values.name || '',
      account_id: Number(values.account_id) || false,
      split_method: values.split_method || 'equal',
      price_unit: Number(values.price_unit || 0),
    };

    const id = await odooCreate('stock.landed.cost.lines', sessionId, payload);
    return res.json({ success: true, id });
  } catch (error) {
    console.error('Create Landed Cost Line Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
