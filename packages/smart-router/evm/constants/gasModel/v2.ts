import { JSBI } from '@pancakeswap/sdk'

// Constant cost for doing any swap regardless of pools.
export const BASE_SWAP_COST_V2 = JSBI.BigInt(135000) // 115000, bumped up by 20_000

// Constant per extra hop in the route.
export const COST_PER_EXTRA_HOP_V2 = JSBI.BigInt(50000) // 20000, bumped up by 30_000
