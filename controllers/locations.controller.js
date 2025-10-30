import { odooSearchRead, odooWrite, odooCreate } from './odooClient.js';

export async function getLocations(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const fields = [
      'name',
      'complete_name',
      'usage',
      'location_id',
      'company_id',
      'scrap_location',
      'is_a_dock',
      'replenish_location',
      'storage_category_id',
      'removal_strategy_id',
      'cyclic_inventory_frequency',
      'comment',
      'last_inventory_date',
      'next_inventory_date',
      'barcode',
      'active',
      'posx', 'posy', 'posz',
    ];
    const locations = await odooSearchRead('stock.location', sessionId, {
      args: [[]],
      kwargs: { fields, limit: 2000 },
    });
    return res.json({ success: true, locations });
  } catch (error) {
    console.error('Get Locations Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
export async function updateLocation(req, res) {
  try {
    const { id } = req.params;
    const { sessionId, values } = req.body || {};
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    const locId = Number(id);
    if (!locId) return res.status(400).json({ message: 'Valid location ID is required' });

    const payload = {};
    if (typeof values?.name === 'string') payload.name = values.name;
    if (typeof values?.usage === 'string') payload.usage = values.usage;
    if (typeof values?.location_id === 'number') payload.location_id = values.location_id || false;
    if (typeof values?.storage_category_id === 'number') payload.storage_category_id = values.storage_category_id || false;
    if (typeof values?.removal_strategy_id === 'number') payload.removal_strategy_id = values.removal_strategy_id || false;
    if (typeof values?.scrap_location === 'boolean') payload.scrap_location = values.scrap_location;
    if (typeof values?.is_a_dock === 'boolean') payload.is_a_dock = values.is_a_dock;
    if (typeof values?.replenish_location === 'boolean') payload.replenish_location = values.replenish_location;
    if (typeof values?.cyclic_inventory_frequency !== 'undefined') payload.cyclic_inventory_frequency = Number(values.cyclic_inventory_frequency) || 0;
    if (typeof values?.comment === 'string') payload.comment = values.comment;

    const ok = await odooWrite('stock.location', sessionId, [locId], payload);
    return res.json({ success: !!ok });
  } catch (error) {
    console.error('Update Location Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function createLocation(req, res) {
  try {
    const { sessionId, values } = req.body || {};
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const payload = {};
    if (typeof values?.name === 'string') payload.name = values.name;
    if (typeof values?.usage === 'string') payload.usage = values.usage;
    if (typeof values?.location_id === 'number') payload.location_id = values.location_id || false;
    if (typeof values?.storage_category_id === 'number') payload.storage_category_id = values.storage_category_id || false;
    if (typeof values?.removal_strategy_id === 'number') payload.removal_strategy_id = values.removal_strategy_id || false;
    if (typeof values?.scrap_location === 'boolean') payload.scrap_location = values.scrap_location;
    if (typeof values?.is_a_dock === 'boolean') payload.is_a_dock = values.is_a_dock;
    if (typeof values?.replenish_location === 'boolean') payload.replenish_location = values.replenish_location;
    if (typeof values?.cyclic_inventory_frequency !== 'undefined') payload.cyclic_inventory_frequency = Number(values.cyclic_inventory_frequency) || 0;
    if (typeof values?.comment === 'string') payload.comment = values.comment;

    const newId = await odooCreate('stock.location', sessionId, payload);
    return res.json({ success: !!newId, id: newId });
  } catch (error) {
    console.error('Create Location Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

