import { odooFieldsGet } from './odooClient.js'

export async function getModelFields(req, res) {
  try {
    const { sessionId, model } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!model || typeof model !== 'string') return res.status(400).json({ message: 'model is required' })

    const meta = await odooFieldsGet(model, sessionId)
    // meta is an object keyed by field name → descriptor
    const fields = Object.keys(meta || {})
    return res.json({ success: true, model, fields, meta })
  } catch (error) {
    console.error('Get Model Fields Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
