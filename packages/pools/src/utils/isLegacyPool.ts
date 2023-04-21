import { LegacySerializedPool, SerializedPool, UpgradedSerializedPool } from '../types'

export function isLegacyPool(pool: SerializedPool): pool is LegacySerializedPool {
  if ((pool as any).tokenPerBlock) {
    return true
  }
  return false
}

export function isUpgradedPool(pool: SerializedPool): pool is UpgradedSerializedPool {
  if ((pool as any).tokenPerSecond) {
    return true
  }
  return false
}
