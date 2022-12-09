import { JSBI, Percent } from '@pancakeswap/sdk'

import { BIPS_BASE } from 'config/constants/exchange'

export const ALLOWED_SLIPPAGE_LOW: Percent = new Percent(JSBI.BigInt(20), BIPS_BASE) // 0.2%
export const ALLOWED_SLIPPAGE_MEDIUM: Percent = new Percent(JSBI.BigInt(50), BIPS_BASE) // 0.5%
export const ALLOWED_SLIPPAGE_HIGH: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const BLOCKED_SLIPPAGE_NON_EXPERT: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%

export function warningSeverity(slippage?: Percent): 0 | 1 | 2 | 3 | 4 {
  if (!slippage?.lessThan(BLOCKED_SLIPPAGE_NON_EXPERT)) return 4
  if (!slippage?.lessThan(ALLOWED_SLIPPAGE_HIGH)) return 3
  if (!slippage?.lessThan(ALLOWED_SLIPPAGE_MEDIUM)) return 2
  if (!slippage?.lessThan(ALLOWED_SLIPPAGE_LOW)) return 1
  return 0
}
