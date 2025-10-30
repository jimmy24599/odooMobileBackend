import { odooSearchRead, odooCreate, odooWrite, odooCallMethod } from './odooClient.js'

const SCRAP_FIELDS = [
  'product_id',
  'product_uom_id',
  'product_qty',
  'location_id',
  'picking_id',
  'company_id',
  'lot_id',
  'package_id',
  'owner_id',
  'state',
  'date_done',
  'create_uid',
]

export async function getScraps(req, res) {
  try {
    const { sessionId } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })

    const kwargs = { }
    const scraps = await odooSearchRead('stock.scrap', sessionId, { args: [[]], kwargs })
    return res.json({ success: true, scraps })
  } catch (error) {
    console.error('Get Scraps Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function createScrap(req, res) {
  try {
    const { sessionId, values } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' })

    const id = await odooCreate('stock.scrap', sessionId, values)
    return res.json({ success: !!id, id })
  } catch (error) {
    console.error('Create Scrap Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function updateScrap(req, res) {
  try {
    const { sessionId, values } = req.body
    const id = parseInt(req.params.id, 10)
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!id || isNaN(id)) return res.status(400).json({ message: 'Valid ID param is required' })
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' })

    const ok = await odooWrite('stock.scrap', sessionId, [id], values)
    return res.json({ success: !!ok })
  } catch (error) {
    console.error('Update Scrap Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function validateScrap(req, res) {
  try {
    const { sessionId } = req.body
    const id = parseInt(req.params.id, 10)
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!id || isNaN(id)) return res.status(400).json({ message: 'Valid ID param is required' })

    const result = await odooCallMethod('stock.scrap', 'action_validate', sessionId, [[id]], {})
    return res.json({ success: true, result })
  } catch (error) {
    console.error('Validate Scrap Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
