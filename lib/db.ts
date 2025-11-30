import path from 'path'
import fs from 'fs'
import type { PromptConfig } from './types'

const dbDir = path.join(process.cwd(), 'data')
const dbPath = path.join(dbDir, 'configs.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
}

function loadConfigs(): PromptConfig[] {
  ensureDataDir()
  if (!fs.existsSync(dbPath)) {
    return []
  }
  const data = fs.readFileSync(dbPath, 'utf-8')
  return JSON.parse(data)
}

function saveConfigs(configs: PromptConfig[]) {
  ensureDataDir()
  fs.writeFileSync(dbPath, JSON.stringify(configs, null, 2))
}

export function initializeDatabase() {
  ensureDataDir()
  if (!fs.existsSync(dbPath)) {
    saveConfigs([])
  }
}

export function getAllConfigs(): PromptConfig[] {
  return loadConfigs().sort((a, b) => {
    const aTime = new Date(a.created_at || 0).getTime()
    const bTime = new Date(b.created_at || 0).getTime()
    return bTime - aTime
  })
}

export function getConfigById(id: number): PromptConfig | undefined {
  return loadConfigs().find((c) => c.id === id)
}

export function createConfig(config: Omit<PromptConfig, 'id' | 'created_at' | 'updated_at'>): PromptConfig {
  const configs = loadConfigs()
  const newId = configs.length > 0 ? Math.max(...configs.map(c => c.id!)) + 1 : 1
  const now = new Date().toISOString()
  const newConfig: PromptConfig = {
    ...config,
    id: newId,
    created_at: now,
    updated_at: now,
  }
  configs.push(newConfig)
  saveConfigs(configs)
  return newConfig
}

export function updateConfig(id: number, updates: Partial<PromptConfig>): PromptConfig | undefined {
  const configs = loadConfigs()
  const index = configs.findIndex((c) => c.id === id)
  if (index === -1) return undefined

  const now = new Date().toISOString()
  const updatedConfig: PromptConfig = {
    ...configs[index],
    ...updates,
    id,
    updated_at: now,
  }
  configs[index] = updatedConfig
  saveConfigs(configs)
  return updatedConfig
}

export function deleteConfig(id: number): boolean {
  const configs = loadConfigs()
  const filtered = configs.filter((c) => c.id !== id)
  if (filtered.length === configs.length) return false
  saveConfigs(filtered)
  return true
}
