import { odooSearchRead, odooCreate } from './odooClient.js';

export async function getStockMoves(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const stockMoves = await odooSearchRead('stock.move', sessionId);

    const detailedMoves = await Promise.all(stockMoves.map(async (move) => {
      if (!move.production_id?.[0]) return { ...move }; // no production order

      const productionId = move.production_id[0];
      const moveId = move.id;

      // Production header (name, dates, BOM, responsible)
      const productions = await odooSearchRead('mrp.production', sessionId, {
        domain: [['id', '=', productionId]],
        fields: ['id', 'name', 'date_planned_start', 'date_planned_finished', 'bom_id', 'user_id', 'product_id'],
      });
      const production = Array.isArray(productions) && productions.length > 0 ? productions[0] : null;

      // Components (raw materials)
      const components = await odooSearchRead('stock.move', sessionId, {
        // Per requirement: only components tied to the current move
        domain: [['raw_material_production_id', '=', moveId]],
        fields: ['id', 'name', 'product_id', 'product_uom_qty', 'quantity_done', 'product_uom', 'location_id', 'location_dest_id', 'state'],
      });

      // Work Orders
      const workOrders = await odooSearchRead('mrp.workorder', sessionId, {
        // Link work orders that directly reference this move in finished move fields
        domain: ['|', ['finished_move_ids', 'in', [moveId]], ['move_finished_ids', 'in', [moveId]]],
        fields: ['id', 'name', 'state', 'qty_production', 'workcenter_id', 'duration_expected', 'duration'],
      });

      // By-products
      const byProducts = await odooSearchRead('stock.move', sessionId, {
        // Only by-products linked to the current move
        domain: ['&', ['byproduct', '=', true], '|', ['origin_move_id', '=', moveId], ['finished_move_ids', 'in', [moveId]]],
        fields: ['id', 'name', 'product_id', 'product_uom_qty', 'quantity_done', 'state'],
      });

      // Miscellaneous (other stock moves linked to production)
      const miscellaneous = await odooSearchRead('stock.move', sessionId, {
        // Non-byproduct stock moves tied to this move (origin or finished linkage)
        domain: ['&', ['byproduct', '=', false], ['raw_material_production_id', '=', false], '|', ['origin_move_id', '=', moveId], ['finished_move_ids', 'in', [moveId]]],
        fields: ['id', 'name', 'product_id', 'product_uom_qty', 'quantity_done', 'product_uom', 'location_id', 'location_dest_id', 'picking_type_id', 'origin', 'state'],
      });

      return {
        ...move,
        production,
        components,
        workOrders,
        byProducts,
        miscellaneous,
      };
    }));
    return res.json({ success: true, stockMoves: detailedMoves });
  } catch (error) {
    console.error('Get Stock Moves Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
export async function getStockMovesByDomain(req, res) {
  try {
    const { sessionId, domain = [], fields = [] } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const kwargs = {};
    if (Array.isArray(fields) && fields.length) kwargs.fields = fields;
    const stockMoves = await odooSearchRead('stock.move', sessionId, { args: [domain], kwargs });
    return res.json({ success: true, stockMoves });
  } catch (error) {
    console.error('Get Stock Moves By Domain Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}


export async function getStockMovesByIds(req, res) {
  try {
    const { sessionId, ids, fields } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ message: 'ids is required' });

    const kwargs = {};
    if (Array.isArray(fields) && fields.length) kwargs.fields = fields;
    const domain = [['id', 'in', ids.map((n) => Number(n))]];
    const stockMoves = await odooSearchRead('stock.move', sessionId, { args: [domain], kwargs });
    return res.json({ success: true, stockMoves });
  } catch (error) {
    console.error('Get Stock Moves By Ids Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createStockMove(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'values is required' });

    const id = await odooCreate('stock.move', sessionId, values);
    return res.json({ success: true, id });
  } catch (error) {
    console.error('Create Stock Move Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
