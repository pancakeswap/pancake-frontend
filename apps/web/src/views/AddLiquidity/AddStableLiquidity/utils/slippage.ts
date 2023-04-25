import { Percent } from '@pancakeswap/sdk'

import { BIPS_BASE } from 'config/constants/exchange'

export const ALLOWED_SLIPPAGE_LOW: Percent = new Percent(9n, BIPS_BASE) // 0.09%
export const ALLOWED_SLIPPAGE_MEDIUM: Percent = new Percent(12n, BIPS_BASE) // 0.12%
export const ALLOWED_SLIPPAGE_HIGH: Percent = new Percent(15n, BIPS_BASE) // 0.15%
export const BLOCKED_SLIPPAGE_NON_EXPERT: Percent = new Percent(20n, BIPS_BASE) // 0.2%

export function warningSeverity(slippage?: Percent): 0 | 1 | 2 | 3 | 4 {
  // Allow to add liquidity if there's no initial liquidity inside the pool
  if (!slippage) {
    return 0
  }
  if (!slippage?.lessThan(BLOCKED_SLIPPAGE_NON_EXPERT)) return 4
  if (!slippage?.lessThan(ALLOWED_SLIPPAGE_HIGH)) return 3
  if (!slippage?.lessThan(ALLOWED_SLIPPAGE_MEDIUM)) return 2
  if (!slippage?.lessThan(ALLOWED_SLIPPAGE_LOW)) return 1
  return 0
}
