import { odooSearchRead } from './odooClient.js';

export async function getWebsites(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const websites = await odooSearchRead('website.website', sessionId);
    return res.json({ success: true, websites });
  } catch (error) {
    console.error('Get Websites Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
