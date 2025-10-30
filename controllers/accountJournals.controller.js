import { odooSearchRead } from './odooClient.js';

export async function getAccountJournals(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const journals = await odooSearchRead('account.journal', sessionId, {
      kwargs: { fields: ['id', 'name', 'code', 'type'] }
    });

    return res.json({ success: true, journals });
  } catch (error) {
    console.error('Get Account Journals Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
