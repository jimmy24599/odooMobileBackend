import { odooCreate, odooSearchRead, odooWrite } from './odooClient.js'

export async function getDeliveryPriceRules(req, res) {
  try {
    const { sessionId, carrier_id } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })

    const args = carrier_id ? [[['carrier_id', '=', Number(carrier_id)]]] : []
    const deliveryPriceRules = await odooSearchRead('delivery.price.rule', sessionId, { args })
    return res.json({ success: true, deliveryPriceRules })
  } catch (error) {
    console.error('Get Delivery Price Rules Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function createDeliveryPriceRule(req, res) {
  try {
    const { sessionId, values } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' })

    const id = await odooCreate('delivery.price.rule', sessionId, values)
    return res.json({ success: !!id, id })
  } catch (error) {
    console.error('Create Delivery Price Rule Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function updateDeliveryPriceRule(req, res) {
  try {
    const { id } = req.params
    const { sessionId, values } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!id) return res.status(400).json({ message: 'Rule ID is required' })
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' })

    const ok = await odooWrite('delivery.price.rule', sessionId, [Number(id)], values)
    return res.json({ success: !!ok })
  } catch (error) {
    console.error('Update Delivery Price Rule Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
