import { odooSearchRead } from './odooClient.js';

// GET list of stock package types
export async function getPackageTypes(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    // Explicit fields to ensure weight/dimensions/units are returned
    const fields = [
      'name',
      'sequence',
      'height',
      'width',
      'packaging_length',
      'base_weight',
      'max_weight',
      'barcode',
      'weight_uom_name',
      'length_uom_name',
      'company_id',
      'storage_category_capacity_ids',
      'display_name',
      'create_uid',
      'create_date',
      'write_uid',
      'write_date',
      'shipper_package_code',
      'package_carrier_type',
    ];

    const packageTypes = await odooSearchRead('stock.package.type', sessionId, {
      args: [],
      kwargs: { limit: 2000, fields },
    });

    return res.json({ success: true, packageTypes });
  } catch (error) {
    console.error('Get Package Types Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
