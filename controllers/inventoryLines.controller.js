import { odooSearchRead } from './odooClient.js';

export async function getInventoryLine(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const inventoryLines = await odooSearchRead('stock.inventory.line', sessionId);
    return res.json({ success: true, inventoryLines });
  } catch (error) {
    console.error('Get Stock Inventory Line Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
