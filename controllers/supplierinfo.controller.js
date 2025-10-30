import { odooSearchRead, odooCreate, odooWrite } from './odooClient.js'

// POST /api/supplierinfo (body: { sessionId, product_id?, product_tmpl_id? })
export async function listSupplierinfo(req, res) {
  try {
    const { sessionId, product_id, product_tmpl_id } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })

    let domain = []
    const hasProd = !!product_id
    const hasTmpl = !!product_tmpl_id

    if (hasProd && hasTmpl) {
      domain = ['|', ['product_id', '=', Number(product_id)], ['product_tmpl_id', '=', Number(product_tmpl_id)]]
    } else if (Array.isArray(product_id) && product_id.length) {
      domain = [['product_id', 'in', product_id.map(Number)]]
    } else if (product_id) {
      domain = [['product_id', '=', Number(product_id)]]
    } else if (Array.isArray(product_tmpl_id) && product_tmpl_id.length) {
      domain = [['product_tmpl_id', 'in', product_tmpl_id.map(Number)]]
    } else if (product_tmpl_id) {
      domain = [['product_tmpl_id', '=', Number(product_tmpl_id)]]
    }

    const result = await odooSearchRead('product.supplierinfo', sessionId, {
      args: [domain],
      kwargs: {
        fields: ['id', 'partner_id', 'product_id', 'product_tmpl_id', 'min_qty', 'price', 'currency_id', 'delay'],
        limit: 200,
      },
    })
    return res.json({ success: true, supplierinfo: Array.isArray(result) ? result : [] })
  } catch (error) {
    console.error('List supplierinfo error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

// POST /api/supplierinfo/create (body: { sessionId, values })
export async function createSupplierinfo(req, res) {
  try {
    const { sessionId, values } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' })

    const id = await odooCreate('product.supplierinfo', sessionId, values)
    return res.json({ success: !!id, id })
  } catch (error) {
    console.error('Create supplierinfo error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

// PUT /api/supplierinfo/:id (body: { sessionId, values })
export async function updateSupplierinfo(req, res) {
  try {
    const { sessionId, values } = req.body
    const id = Number(req.params.id)
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!id) return res.status(400).json({ message: 'ID is required' })
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' })

    const ok = await odooWrite('product.supplierinfo', sessionId, [id], values)
    return res.json({ success: !!ok })
  } catch (error) {
    console.error('Update supplierinfo error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
