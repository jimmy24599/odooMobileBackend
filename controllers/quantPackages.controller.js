import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js'

export async function getQuantPackages(req, res) {
  try {
    const { sessionId } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })

    const packages = await odooSearchRead('stock.quant.package', sessionId, { args: [[]], kwargs: {} })
    return res.json({ success: true, packages })
  } catch (error) {
    console.error('Get Quant Packages Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function createQuantPackage(req, res) {
  try {
    const { sessionId, values = {} } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })

    const payload = {
      name: values.name || values.reference || undefined,
      package_type_id: values.package_type_id || undefined,
      owner_id: values.owner_id || undefined,
      location_id: values.location_id || undefined,
    }

    const newId = await odooCreate('stock.quant.package', sessionId, payload)
    return res.json({ success: true, id: newId })
  } catch (error) {
    console.error('Create Quant Package Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function updateQuantPackage(req, res) {
  try {
    const { sessionId, values = {} } = req.body
    const id = parseInt(req.params.id, 10)
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!id || isNaN(id)) return res.status(400).json({ message: 'Valid ID param is required' })

    const payload = {
      name: values.name || values.reference || undefined,
      package_type_id: values.package_type_id || undefined,
      owner_id: values.owner_id || undefined,
      location_id: values.location_id || undefined,
    }

    const ok = await odooWrite('stock.quant.package', sessionId, [id], payload)
    return res.json({ success: !!ok })
  } catch (error) {
    console.error('Update Quant Package Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
