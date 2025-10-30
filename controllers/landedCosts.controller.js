import { odooSearchRead, odooRead, odooCreate, odooWrite } from './odooClient.js';

export async function getLandedCosts(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const landedCosts = await odooSearchRead('stock.landed.cost', sessionId);
    return res.json({ success: true, landedCosts });
  } catch (error) {
    console.error('Get Landed Costs Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function getLandedCostById(req, res) {
  try {
    const { id } = req.params;
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const ids = [Number(id)];
    const [record] = await odooRead('stock.landed.cost', sessionId, ids, []);
    return res.json({ success: true, landedCost: record });
  } catch (error) {
    console.error('Get Landed Cost Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createLandedCost(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values) return res.status(400).json({ message: 'Values are required' });

    const {
      name,
      date,
      account_journal_id,
      account_move_id,
      vendor_bill_id,
      target_model,
    } = values;

    // Normalize cost_lines to Odoo one2many command syntax
    const toCommands = (lines) => {
      if (!Array.isArray(lines)) return []
      // If already commands like [0,0,{...}] or [1,id,{...}] etc., pass through
      const looksLikeCommand = (x) => Array.isArray(x) && typeof x[0] === 'number'
      if (lines.every(looksLikeCommand)) return lines
      // Otherwise treat as list of dicts and convert to create commands
      return lines.map((ln) => ([0, 0, {
        product_id: ln.product_id || ln.productId || false,
        name: ln.name || ln.description || '',
        account_id: ln.account_id || ln.accountId || false,
        split_method: ln.split_method || ln.splitMethod || 'equal',
        price_unit: Number(ln.price_unit ?? ln.cost ?? 0),
      }]))
    }

    const normalizePicking = (p) => {
      if (!p) return {}
      // If already command(s) like [[6,0,[ids]]] just pass through
      if (Array.isArray(p) && Array.isArray(p[0]) && typeof p[0][0] === 'number') {
        return { picking_ids: p }
      }
      if (Array.isArray(p)) {
        const ids = p.map((x) => Number(Array.isArray(x) ? x[0] : x)).filter(Boolean)
        return { picking_ids: [[6, 0, ids]] }
      }
      const id = Number(p)
      return id ? { picking_ids: [[6, 0, [id]] ] } : {}
    }

    const payload = {
      // basic fields
      name: typeof name === 'string' ? name : undefined,
      date: date || undefined,
      // journal mapping: prefer account_journal_id, fallback to journal_id
      journal_id: account_journal_id || false,
      // vendor bill mapping: prefer vendor_bill_id, fallback to legacy account_move_id
      vendor_bill_id: vendor_bill_id || account_move_id || false,
      // target model and pickings
      target_model: target_model || undefined,
      ...normalizePicking(picking_ids),
    };

    const newId = await odooCreate('stock.landed.cost', sessionId, payload);
    return res.json({ success: true, id: newId });
  } catch (error) {
    console.error('Create Landed Cost Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function updateLandedCost(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values) return res.status(400).json({ message: 'Values are required' });

    const {
      name,
      date,
      account_journal_id,
      account_move_id,
      vendor_bill_id,
      target_model,
      picking_ids,
    } = values;

    // Normalize cost_lines to Odoo one2many command syntax
    const toCommands = (lines) => {
      if (!Array.isArray(lines)) return []
      const looksLikeCommand = (x) => Array.isArray(x) && typeof x[0] === 'number'
      if (lines.every(looksLikeCommand)) return lines
      return lines.map((ln) => ([0, 0, {
        product_id: ln.product_id || ln.productId || false,
        name: ln.name || ln.description || '',
        account_id: ln.account_id || ln.accountId || false,
        split_method: ln.split_method || ln.splitMethod || 'equal',
        price_unit: Number(ln.price_unit ?? ln.cost ?? 0),
      }]))
    }

    const normalizePicking = (p) => {
      if (!p) return {}
      if (Array.isArray(p) && Array.isArray(p[0]) && typeof p[0][0] === 'number') {
        return { picking_ids: p }
      }
      if (Array.isArray(p)) {
        const ids = p.map((x) => Number(Array.isArray(x) ? x[0] : x)).filter(Boolean)
        return { picking_ids: [[6, 0, ids]] }
      }
      const id = Number(p)
      return id ? { picking_ids: [[6, 0, [id]] ] } : {}
    }

    const payload = {
      name: typeof name === 'string' ? name : undefined,
      date: date || undefined,
      account_journal_id: account_journal_id || false,
      vendor_bill_id: vendor_bill_id || account_move_id || false,
      target_model: target_model || undefined,
      ...normalizePicking(picking_ids),
    };

    const ok = await odooWrite('stock.landed.cost', sessionId, [Number(id)], payload);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Landed Cost Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
