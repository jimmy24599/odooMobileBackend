import { odooSearchRead } from './odooClient.js';

export async function getPosCategories(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const posCategories = await odooSearchRead('pos.category', sessionId);
    return res.json({ success: true, posCategories });
  } catch (error) {
    console.error('Get POS Categories Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
