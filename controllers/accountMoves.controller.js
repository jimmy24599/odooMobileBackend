import { odooSearchRead } from './odooClient.js';

export async function getVendorBills(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    // Vendor bills in Odoo are account.move with move_type = 'in_invoice'
    const bills = await odooSearchRead('account.move', sessionId, {
      kwargs: {
        domain: [["move_type", "=", "in_invoice"]],
        fields: ['id', 'name', 'ref', 'partner_id', 'amount_total', 'state', 'invoice_date']
      }
    });

    return res.json({ success: true, vendorBills: bills });
  } catch (error) {
    console.error('Get Vendor Bills Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
