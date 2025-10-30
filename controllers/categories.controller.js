import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js';

export async function getCategories(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const categories = await odooSearchRead('product.category', sessionId, {
      args: [],
      kwargs: {
        fields: ['id', 'name', 'parent_id', 'complete_name', 'child_id'],
        limit: 2000,
      },
    });
    return res.json({ success: true, categories });
  } catch (error) {
    console.error('Get Product Categories Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createCategory(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values || !values.name) return res.status(400).json({ message: 'Missing required fields' });

    const payload = {
      name: values.name,
      ...(values.parent_id ? { parent_id: values.parent_id } : {}),
    };
    const id = await odooCreate('product.category', sessionId, payload);
    return res.json({ success: true, id });
  } catch (error) {
    console.error('Create Product Category Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const catId = Number(id);
    if (!catId || !values) return res.status(400).json({ message: 'Invalid request' });

    const payload = {};
    if (typeof values.name === 'string') payload.name = values.name;
    if (values.parent_id === false || Number.isInteger(values.parent_id)) payload.parent_id = values.parent_id;

    const ok = await odooWrite('product.category', sessionId, [catId], payload);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Product Category Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
