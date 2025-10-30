import { odooSearchRead } from './odooClient.js'

// Fetch product attributes and their values, and merge them
export async function getAttributes(req, res) {
  try {
    const { sessionId } = req.body
    if (!sessionId) return res.status(400).json({ success: false, message: 'Session ID is required' })

    // 1) Read attributes (limit high to be safe)
    const attributes = await odooSearchRead('product.attribute', sessionId, {
      args: [],
      kwargs: {
      },
    })

    const allValueIds = Array.from(
      new Set(
        (attributes || []).flatMap((a) => Array.isArray(a.value_ids) ? a.value_ids : [])
      )
    )

    let valuesByAttr = {}
    if (allValueIds.length) {
      // 2) Read attribute values for those ids
      const values = await odooSearchRead('product.attribute.value', sessionId, {
        args: [[['id', 'in', allValueIds]]],
        kwargs: {
        },
      })
      for (const v of values || []) {
        const attrId = Array.isArray(v.attribute_id) ? v.attribute_id[0] : v.attribute_id
        if (!valuesByAttr[attrId]) valuesByAttr[attrId] = []
        valuesByAttr[attrId].push(v)
      }
    }

    // 3) Merge values under each attribute
    const merged = (attributes || []).map((a) => {
      const id = a.id
      const vals = valuesByAttr[id] || []
      return { ...a, values: vals }
    })

    return res.json({ success: true, attributes: merged })
  } catch (error) {
    console.error('Get Attributes Error:', error?.data || error?.message || error)
    return res.status(500).json({ success: false, message: 'Internal server error', error: error?.data || error?.message || String(error) })
  }
}
