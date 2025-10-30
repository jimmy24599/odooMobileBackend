import { odooSearchRead } from './odooClient.js';

export async function getPartners(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    // Fetch partners (you may filter suppliers only later if needed)
    const partners = await odooSearchRead('res.partner', sessionId);
    return res.json({ success: true, partners });
  } catch (error) {
    console.error('Get Partners Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
