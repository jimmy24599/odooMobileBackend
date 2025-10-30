import { odooSearchRead } from './odooClient.js'

export async function getRepairTags(req, res) {
  try {
    const { sessionId } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    const tags = await odooSearchRead('repair.tags', sessionId)
    return res.json({ success: true, tags })
  } catch (error) {
    console.error('Get Repair Tags Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
