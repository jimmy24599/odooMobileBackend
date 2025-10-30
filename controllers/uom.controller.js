import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js';

export async function getUom(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const uom = await odooSearchRead('uom.uom', sessionId);
    return res.json({ success: true, uom });
  } catch (error) {
    console.error('Get UOM Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createUom(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ success: false, message: 'Session ID is required' });
    if (!values || !values.name || !values.category_id) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const payload = {
      name: values.name,
      uom_type: values.uom_type, // 'reference' | 'bigger' | 'smaller'
      active: values.active !== false,
      category_id: values.category_id,
    };
    if (typeof values.ratio === 'number') payload.ratio = values.ratio;

    const id = await odooCreate('uom.uom', sessionId, payload);
    return res.json({ success: true, id });
  } catch (error) {
    console.error('Create UOM Error:', error?.data || error.message);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function updateUom(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ success: false, message: 'Session ID is required' });
    const recordId = Number(id);
    if (!recordId) return res.status(400).json({ success: false, message: 'Invalid ID' });

    const payload = {};
    if (typeof values?.name === 'string') payload.name = values.name;
    if (typeof values?.uom_type === 'string') payload.uom_type = values.uom_type;
    if (typeof values?.active === 'boolean') payload.active = values.active;
    if (typeof values?.ratio === 'number') payload.ratio = values.ratio;
    if (Number.isInteger(values?.category_id)) payload.category_id = values.category_id;

    const ok = await odooWrite('uom.uom', sessionId, [recordId], payload);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update UOM Error:', error?.data || error.message);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error?.data || error.message });
  }
}
