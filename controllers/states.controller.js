import { odooSearchRead } from './odooClient.js'

export async function getStates(req, res) {
  try {
    const { sessionId, country_id } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    const args = country_id ? [[['country_id', '=', Number(country_id)]]] : []
    const states = await odooSearchRead('res.country.state', sessionId, { args })
    return res.json({ success: true, states })
  } catch (error) {
    console.error('Get States Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
