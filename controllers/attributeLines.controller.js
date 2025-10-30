import { odooSearchRead } from './odooClient.js'

export async function getTemplateAttributeLines(req, res) {
  try {
    const { sessionId, templateId } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    if (!templateId) return res.status(400).json({ message: 'templateId is required' })

    const lines = await odooSearchRead('product.template.attribute.line', sessionId, {
      args: [[['product_tmpl_id', '=', Number(templateId)]]],
      kwargs: {
        fields: ['id', 'attribute_id', 'value_ids', 'product_tmpl_id'],
        limit: 200,
      },
    })
    return res.json({ success: true, attributeLines: lines })
  } catch (error) {
    console.error('Get Template Attribute Lines Error:', error?.data || error.message)
    return res.status(500).json({
      message: 'Internal server error',
      error: error?.data || error.message,
    })
  }
}
