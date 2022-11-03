import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'

export const DOMAIN = 'https://aptos.pancakeswap.finance'
export const BASE_ADD_LIQUIDITY_URL = `${DOMAIN}/add`

export const APEX_DOMAIN = process.env.NEXT_PUBLIC_APEX_URL

export const LOW_APT = 0.1
export const DEFAULT_TOKEN_DECIMAL = getFullDecimalMultiplier(18)
export const FARMS_DEFAULT_TOKEN_DECIMAL = getFullDecimalMultiplier(8)

export const BSC_BLOCK_TIME = 3
export const BLOCKS_PER_DAY = (60 / BSC_BLOCK_TIME) * 60 * 24
export const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365 // 10512000
