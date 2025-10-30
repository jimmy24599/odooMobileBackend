import { odooSearchRead } from './odooClient.js';

export async function getPartnerTitles(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const partnerTitles = await odooSearchRead('res.partner.title', sessionId);
    return res.json({ success: true, partnerTitles });
  } catch (error) {
    console.error('Get Partner Titles Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
