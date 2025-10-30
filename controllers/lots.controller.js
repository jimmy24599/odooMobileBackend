import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js';

export async function getLots(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const lots = await odooSearchRead('stock.lot', sessionId);
    return res.json({ success: true, lots });
  } catch (error) {
    console.error('Get Lots and Serial Numbers Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createLot(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' });

    // Expected minimal fields: name, product_id
    const id = await odooCreate('stock.lot', sessionId, values);
    return res.json({ success: !!id, id });
  } catch (error) {
    console.error('Create Lot Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function updateLot(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!id) return res.status(400).json({ message: 'Lot ID is required' });
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' });

    const ok = await odooWrite('stock.lot', sessionId, [Number(id)], values);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Lot Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
