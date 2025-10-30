import { odooSearchRead } from './odooClient.js';

export async function getWorkcenters(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const workcenters = await odooSearchRead('mrp.workcenter', sessionId);
    return res.json({ success: true, workcenters });
  } catch (error) {
    console.error('Get Workcenters Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
