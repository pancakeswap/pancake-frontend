import { PoolSelectorConfig } from '../types'

export function mergePoolSelectorConfig(baseConfig: PoolSelectorConfig, customConfig?: Partial<PoolSelectorConfig>) {
  if (!customConfig) {
    return baseConfig
  }

  const merged = { ...baseConfig }
  const keys = Object.keys(merged) as (keyof PoolSelectorConfig)[]
  for (const key of keys) {
    merged[key] = Math.max(merged[key], customConfig[key] || 0)
  }
  return merged
}
