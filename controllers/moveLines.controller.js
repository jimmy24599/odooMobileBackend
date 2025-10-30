import { odooSearchRead, odooCreate } from './odooClient.js';

export async function getStockMoveLines(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const moveLines = await odooSearchRead('stock.move.line', sessionId);
    return res.json({ success: true, moveLines });
  } catch (error) {
    console.error('Get Stock Move Lines Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function getStockMoveLinesByPicking(req, res) {
  try {
    const { sessionId, pickingId, fields } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!pickingId) return res.status(400).json({ message: 'pickingId is required' });

    const kwargs = {};
    if (Array.isArray(fields) && fields.length) {
      kwargs.fields = fields;
    }
    const domain = [["picking_id", "=", Number(pickingId)]];
    const moveLines = await odooSearchRead('stock.move.line', sessionId, { args: [domain], kwargs });
    return res.json({ success: true, moveLines });
  } catch (error) {
    console.error('Get Stock Move Lines By Picking Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createStockMoveLine(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'values is required' });

    const id = await odooCreate('stock.move.line', sessionId, values);
    return res.json({ success: true, id });
  } catch (error) {
    console.error('Create Stock Move Line Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
