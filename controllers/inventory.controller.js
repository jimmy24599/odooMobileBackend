import { odooSearchRead } from './odooClient.js';

export async function getInventory(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const inventory = await odooSearchRead('stock.inventory', sessionId);
    return res.json({ success: true, inventory });
  } catch (error) {
    console.error('Get Stock Inventory Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
