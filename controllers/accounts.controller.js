import { odooSearchRead } from './odooClient.js';

export async function getAccounts(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const accounts = await odooSearchRead('account.account', sessionId, {
      kwargs: { fields: ['id', 'name', 'code'] }
    });

    return res.json({ success: true, accounts });
  } catch (error) {
    console.error('Get Accounts Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
