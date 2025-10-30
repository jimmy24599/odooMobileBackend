import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js';

export async function getStockPickingTypes(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const fields = [
      'name','code','sequence_code','warehouse_id','default_location_src_id','default_location_dest_id','return_picking_type_id','create_backorder','active',
      // boolean flags used by UI
      'show_entire_packs','use_existing_lots','use_create_lots','show_operations','auto_show_reception_report',
      'auto_print_delivery_slip','auto_print_return_slip','auto_print_product_labels','auto_print_lot_labels','auto_print_reception_report','auto_print_reception_report_labels','auto_print_packages','auto_print_package_label',
      'is_repairable','auto_batch','batch_auto_confirm','batch_group_by_partner','analytic_costs','is_favorite'
    ];
    const stockPickingTypes = await odooSearchRead('stock.picking.type', sessionId, { args: [[]], kwargs: { fields, limit: 2000 } });
    try {
      if (Array.isArray(stockPickingTypes)) {
        const first = stockPickingTypes[0] || {};
       
      } else {
        console.log('ODK stock.picking.type non-array response type:', typeof stockPickingTypes);
      }
    } catch (logErr) {
      console.warn('Logging stock.picking.type fields failed:', logErr?.message || logErr);
    }
    return res.json({ success: true, stockPickingTypes });
  } catch (error) {
    console.error('Get Stock Picking Type Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
// POST create a new stock picking type
export async function createStockPickingType(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values) return res.status(400).json({ message: 'Values are required' });

    const payload = {};
    if (typeof values.name === 'string') payload.name = values.name;
    if (typeof values.code === 'string') payload.code = values.code; // incoming | outgoing | internal
    if (typeof values.sequence_code === 'string') payload.sequence_code = values.sequence_code;
    if (Number.isInteger(values.warehouse_id)) payload.warehouse_id = values.warehouse_id;
    if (Number.isInteger(values.default_location_src_id)) payload.default_location_src_id = values.default_location_src_id;
    if (Number.isInteger(values.default_location_dest_id)) payload.default_location_dest_id = values.default_location_dest_id;
    if (Number.isInteger(values.return_picking_type_id)) payload.return_picking_type_id = values.return_picking_type_id;
    if (typeof values.create_backorder === 'string') payload.create_backorder = values.create_backorder; // ask | always | never
    if (typeof values.active === 'boolean') payload.active = values.active;

    // Optional booleans for printing and settings if supported by server
    const boolKeys = [
      'show_entire_packs',
      'use_existing_lots',
      'use_create_lots',
      'show_operations',
      'auto_show_reception_report',
      'auto_print_delivery_slip',
      'auto_print_return_slip',
      'auto_print_product_labels',
      'auto_print_lot_labels',
      'auto_print_reception_report',
      'auto_print_reception_report_labels',
      'auto_print_packages',
      'auto_print_package_label',
      'is_repairable',
      'auto_batch',
      'batch_auto_confirm',
      'batch_group_by_partner',
      'batch_group_by_carrier',
      'batch_group_by_destination',
      'batch_group_by_src_loc',
      'batch_group_by_dest_loc',
      'wave_group_by_product',
      'wave_group_by_category',
      'wave_group_by_location',
      'analytic_costs',
      'is_favorite',
    ];
    for (const k of boolKeys) {
      if (typeof values[k] === 'boolean') payload[k] = values[k];
    }

    // Optional numeric fields for batches
    if (Number.isInteger(values.batch_max_lines)) payload.batch_max_lines = values.batch_max_lines;
    if (Number.isInteger(values.batch_max_pickings)) payload.batch_max_pickings = values.batch_max_pickings;
    if (typeof values.batch_max_weight === 'number') payload.batch_max_weight = values.batch_max_weight;

    const id = await odooCreate('stock.picking.type', sessionId, payload);
    return res.json({ success: true, id });
  } catch (error) {
    console.error('Create Stock Picking Type Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

// PUT update an existing stock picking type
export async function updateStockPickingType(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const typeId = Number(id);
    if (!typeId || !values) return res.status(400).json({ message: 'Invalid request' });

    const payload = {};
    if (typeof values.name === 'string') payload.name = values.name;
    if (typeof values.code === 'string') payload.code = values.code;
    if (typeof values.sequence_code === 'string') payload.sequence_code = values.sequence_code;
    if (Number.isInteger(values.warehouse_id)) payload.warehouse_id = values.warehouse_id;
    if (Number.isInteger(values.default_location_src_id)) payload.default_location_src_id = values.default_location_src_id;
    if (Number.isInteger(values.default_location_dest_id)) payload.default_location_dest_id = values.default_location_dest_id;
    if (Number.isInteger(values.return_picking_type_id)) payload.return_picking_type_id = values.return_picking_type_id;
    if (typeof values.create_backorder === 'string') payload.create_backorder = values.create_backorder;
    if (typeof values.active === 'boolean') payload.active = values.active;

    const boolKeys = [
      'show_entire_packs',
      'use_existing_lots',
      'use_create_lots',
      'show_operations',
      'auto_show_reception_report',
      'auto_print_delivery_slip',
      'auto_print_return_slip',
      'auto_print_product_labels',
      'auto_print_lot_labels',
      'auto_print_reception_report',
      'auto_print_reception_report_labels',
      'auto_print_packages',
      'auto_print_package_label',
      'is_repairable',
      'auto_batch',
      'batch_auto_confirm',
      'batch_group_by_partner',
      'analytic_costs',
      'is_favorite',
    ];
    for (const k of boolKeys) {
      if (typeof values[k] === 'boolean') payload[k] = values[k];
    }

    const ok = await odooWrite('stock.picking.type', sessionId, [typeId], payload);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Stock Picking Type Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
