import { odooSearchRead, odooCreate } from './odooClient.js'

export async function getRepairs(req, res) {
  try {
    const { sessionId, lot_id } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    const args = []
    if (lot_id) args.push([['lot_id', '=', Number(lot_id)]])
    const repairs = await odooSearchRead('repair.order', sessionId, { args })
    return res.json({ success: true, repairs })
  } catch (error) {
    console.error('Get Repairs Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function createRepair(req, res) {
  try {
    const { sessionId, values } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'values is required' })
    const id = await odooCreate('repair.order', sessionId, values)
    return res.json({ success: true, id })
  } catch (error) {
    console.error('Create Repair Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
