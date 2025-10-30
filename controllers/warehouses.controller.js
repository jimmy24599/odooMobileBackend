import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js';

export async function getWarehouses(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const fields = [
      'name','active','company_id','partner_id','view_location_id','lot_stock_id','code','route_ids','reception_steps','delivery_steps',
      'wh_input_stock_loc_id','wh_qc_stock_loc_id','wh_output_stock_loc_id','wh_pack_stock_loc_id','mto_pull_id','pick_type_id','pack_type_id',
      'out_type_id','in_type_id','int_type_id','qc_type_id','store_type_id','xdock_type_id','crossdock_route_id','reception_route_id','delivery_route_id',
      'resupply_wh_ids','resupply_route_ids','sequence','display_name','create_uid','create_date','write_uid','write_date','manufacture_to_resupply',
      'manufacture_pull_id','manufacture_mto_pull_id','pbm_mto_pull_id','sam_rule_id','manu_type_id','pbm_type_id','sam_type_id','manufacture_steps',
      'pbm_route_id','pbm_loc_id','sam_loc_id','subcontracting_to_resupply','subcontracting_mto_pull_id','subcontracting_pull_id','subcontracting_route_id',
      'subcontracting_type_id','subcontracting_resupply_type_id','pos_type_id','buy_to_resupply','buy_pull_id','repair_type_id','repair_mto_pull_id',
      'subcontracting_dropshipping_to_resupply','subcontracting_dropshipping_pull_id'
    ];
    const warehouses = await odooSearchRead('stock.warehouse', sessionId, {
      args: [[]],
      kwargs: { fields, limit: 2000 }
    });
    return res.json({ success: true, warehouses });
  } catch (error) {
    console.error('Get Warehouses Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createWarehouse(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' });

    const id = await odooCreate('stock.warehouse', sessionId, values);
    return res.json({ success: !!id, id });
  } catch (error) {
    console.error('Create Warehouse Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function updateWarehouse(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!id || isNaN(Number(id))) return res.status(400).json({ message: 'Valid ID param is required' });
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' });

    const ok = await odooWrite('stock.warehouse', sessionId, [Number(id)], values);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Warehouse Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
