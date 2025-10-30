import { odooSearchRead } from './odooClient.js'

export async function getZipPrefixes(req, res) {
  try {
    const { sessionId } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    const zipPrefixes = await odooSearchRead('delivery.zip.prefix', sessionId)
    return res.json({ success: true, zipPrefixes })
  } catch (error) {
    console.error('Get Zip Prefixes Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
