import { odooSearchRead } from './odooClient.js';

export async function getQuants(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const quants = await odooSearchRead('stock.quant', sessionId);
    try {
      if (Array.isArray(quants)) {
        const first = quants[0] || {};
        
      } else {
        console.log('ODK stock.quant non-array response type:', typeof quants);
      }
    } catch (logErr) {
      console.warn('Logging stock.quant fields failed:', logErr?.message || logErr);
    }
    return res.json({ success: true, quants });
  } catch (error) {
    console.error('Get Quants Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
