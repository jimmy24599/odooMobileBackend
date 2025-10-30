import { odooSearchRead } from './odooClient.js';

export async function getAccountTaxes(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const taxes = await odooSearchRead('account.tax', sessionId);
    return res.json({ success: true, taxes });
  } catch (error) {
    console.error('Get Account Taxes Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
