import { odooSearchRead } from './odooClient.js'

export async function getAttributeValues(req, res) {
  try {
    const { sessionId } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })

    const values = await odooSearchRead('product.attribute.value', sessionId, {
      args: [],
      kwargs: {
        fields: ['id', 'name', 'html_color', 'attribute_id'],
        limit: 500,
      },
    })
    return res.json({ success: true, attributeValues: values })
  } catch (error) {
    console.error('Get Attribute Values Error:', error?.data || error.message)
    return res.status(500).json({
      message: 'Internal server error',
      error: error?.data || error.message,
    })
  }
}
