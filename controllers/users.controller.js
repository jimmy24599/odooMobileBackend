export async function updateDevice(req, res) {
  try {
    const { sessionId, values } = req.body
    const { id } = req.params
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    const deviceId = Number(id)
    if (!deviceId) return res.status(400).json({ message: 'Device id is required' })

    const ok = await odooCallMethod('res.device', 'write', sessionId, [[deviceId], values])
    if (ok !== true) return res.status(400).json({ success: false, message: 'Write failed' })

    const result = await odooCallMethod(
      'res.device',
      'read',
      sessionId,
      [[deviceId]],
      { fields: ['id','device_type','platform','ip_address','is_current','city','last_activity','revoked', 'display_name', 'browser'] }
    )
    const device = Array.isArray(result) ? result[0] : result
    return res.json({ success: true, device })
  } catch (error) {
    console.error('updateDevice error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
export async function getDevicesByIds(req, res) {
  try {
    const { sessionId, ids, fields } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    const idList = Array.isArray(ids) ? ids.map((n) => Number(n)).filter(Boolean) : []
    if (idList.length === 0) return res.json({ success: true, devices: [] })
    const result = await odooCallMethod(
      'res.device',
      'read',
      sessionId,
      [idList],
      { fields: fields && Array.isArray(fields) ? fields : ['id','device_type','platform','ip_address','is_current','city','last_activity','revoked'] }
    )
    const devices = Array.isArray(result) ? result : []
    return res.json({ success: true, devices })
  } catch (error) {
    console.error('getDevicesByIds error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
import { odooSearchRead, odooCallMethod } from './odooClient.js'

export async function getUsers(req, res) {
  try {
    const { sessionId } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    const users = await odooSearchRead('res.users', sessionId)
    return res.json({ success: true, users })
  } catch (error) {
    console.error('Get Users Error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function getUserById(req, res) {
  try {
    const { sessionId, id } = req.body
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    const userId = Number(id)
    if (!userId) return res.status(400).json({ message: 'User id is required' })
    const result = await odooCallMethod(
      'res.users',
      'read',
      sessionId,
      [[userId]],
      { fields: ['id','name','login','notification_type','odoobot_state','signature','property_warehouse_id','calendar_default_privacy','email','device_ids'] }
    )
    const user = Array.isArray(result) ? result[0] : result
    return res.json({ success: true, user })
  } catch (error) {
    console.error('getUserById error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}

export async function updateUser(req, res) {
  try {
    const { sessionId, values } = req.body
    const { id } = req.params
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' })
    const userId = Number(id)
    if (!userId) return res.status(400).json({ message: 'User id is required' })

    // values: direct mapping of fields to write
    const ok = await odooCallMethod('res.users', 'write', sessionId, [[userId], values])
    if (ok !== true) return res.status(400).json({ success: false, message: 'Write failed' })

    // Return updated record
    const result = await odooCallMethod(
      'res.users',
      'read',
      sessionId,
      [[userId]],
      { fields: ['id','name','login','notification_type','odoobot_state','signature','property_warehouse_id','calendar_default_privacy','email','device_ids'] }
    )
    const user = Array.isArray(result) ? result[0] : result
    return res.json({ success: true, user })
  } catch (error) {
    console.error('updateUser error:', error?.data || error.message)
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message })
  }
}
