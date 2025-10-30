import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js';

export async function getProductions(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const productions = await odooSearchRead('mrp.production', sessionId);
    return res.json({ success: true, productions });
  } catch (error) {
    console.error('Get Productions Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createProduction(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' });

    const newId = await odooCreate('mrp.production', sessionId, values);
    return res.json({ success: !!newId, id: newId });
  } catch (error) {
    console.error('Create Production Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function updateProduction(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!id) return res.status(400).json({ message: 'Production ID is required' });
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' });

    const ok = await odooWrite('mrp.production', sessionId, [Number(id)], values);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Production Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
