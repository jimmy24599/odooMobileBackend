import { odooSearchRead, odooWrite } from './odooClient.js'

export async function getPickingTransfers(req, res) {
  try {
    const { sessionId } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })

    const pickingTransfers = await odooSearchRead('stock.picking', sessionId)
    return res.json({ success: true, pickingTransfers })
  } catch (error) {
    console.error('Get Picking Transfers Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function updatePickingTransfer(req, res) {
  try {
    const { sessionId, values } = req.body
    const id = parseInt(req.params.id, 10)
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!id || isNaN(id)) return res.status(400).json({ message: 'Valid ID param is required' })
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' })

    const result = await odooWrite('stock.picking', sessionId, [id], values)
    return res.json({ success: !!result })
  } catch (error) {
    console.error('Update Picking Transfer Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
