import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Place settings.json one level up from controllers folder, inside backend/
const settingsPath = path.join(__dirname, '..', 'settings.json')

function ensureFile() {
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify({ baseUrl: '', company: '', db: '' }, null, 2))
  }
}

export function getSettings() {
  try {
    ensureFile()
    const raw = fs.readFileSync(settingsPath, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return { baseUrl: '', company: '', db: '' }
  }
}

export function saveSettings({ baseUrl, company, db }) {
  ensureFile()
  const current = getSettings()
  const next = {
    baseUrl: typeof baseUrl === 'string' ? baseUrl : current.baseUrl,
    company: typeof company === 'string' ? company : current.company,
    db: typeof db === 'string' ? db : current.db,
  }
  fs.writeFileSync(settingsPath, JSON.stringify(next, null, 2))
  return next
}
