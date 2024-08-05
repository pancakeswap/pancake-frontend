import { Percent } from '@pancakeswap/sdk'

export {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES,
  V2_ROUTER_ADDRESS,
} from '@pancakeswap/smart-router'

export const BIPS_BASE = 10000n

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(50n, BIPS_BASE)
