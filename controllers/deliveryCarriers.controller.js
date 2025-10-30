import { odooCreate, odooSearchRead, odooWrite } from './odooClient.js'

export async function getDeliveryCarriers(req, res) {
  try {
    const { sessionId } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })

    const deliveryCarriers = await odooSearchRead('delivery.carrier', sessionId)
    return res.json({ success: true, deliveryCarriers })
  } catch (error) {
    console.error('Get Delivery Carriers Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function createDeliveryCarrier(req, res) {
  try {
    const { sessionId, values } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' })

    const id = await odooCreate('delivery.carrier', sessionId, values)
    return res.json({ success: !!id, id })
  } catch (error) {
    console.error('Create Delivery Carrier Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function updateDeliveryCarrier(req, res) {
  try {
    const { id } = req.params
    const { sessionId, values } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!id) return res.status(400).json({ message: 'Carrier ID is required' })
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' })

    const ok = await odooWrite('delivery.carrier', sessionId, [Number(id)], values)
    return res.json({ success: !!ok })
  } catch (error) {
    console.error('Update Delivery Carrier Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
