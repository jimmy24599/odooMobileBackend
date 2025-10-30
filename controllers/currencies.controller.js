import { odooSearchRead } from './odooClient.js';

export async function getCurrencies(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const currencies = await odooSearchRead('res.currency', sessionId);
    return res.json({ success: true, currencies });
  } catch (error) {
    console.error('Get Currencies Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
