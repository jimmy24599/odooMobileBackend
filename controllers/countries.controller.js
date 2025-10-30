import { odooSearchRead } from './odooClient.js';

export async function getCountries(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const countries = await odooSearchRead('res.country', sessionId);
    return res.json({ success: true, countries });
  } catch (error) {
    console.error('Get Countries Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
