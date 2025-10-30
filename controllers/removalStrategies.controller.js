import { odooSearchRead } from './odooClient.js';

// GET list of product removal strategies
export async function getRemovalStrategies(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    // product.removal holds strategies; fetch id and display fields
    const strategies = await odooSearchRead('product.removal', sessionId, {
      args: [],
      kwargs: { limit: 2000 },
    });

    return res.json({ success: true, removalStrategies: strategies });
  } catch (error) {
    console.error('Get Removal Strategies Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
