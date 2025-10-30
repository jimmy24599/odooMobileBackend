import { getSettings, saveSettings } from './settingsStore.js'

export const readSettings = async (req, res) => {
  try {
    const settings = getSettings()
    return res.json({ success: true, settings })
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to read settings' })
  }
}

export const writeSettings = async (req, res) => {
  try {
    const { baseUrl, company, db } = req.body || {}
    if (!baseUrl || !db) {
      return res.status(400).json({ success: false, message: 'baseUrl and db are required' })
    }
    const saved = saveSettings({ baseUrl, company: company || '', db })
    return res.json({ success: true, settings: saved })
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to save settings' })
  }
}
