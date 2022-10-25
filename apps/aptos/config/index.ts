import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'

export const DOMAIN = 'https://aptos.pancakeswap.finance'

export const APEX_DOMAIN = process.env.NEXT_PUBLIC_APEX_URL

export const LOW_APT = 0.1
export const DEFAULT_TOKEN_DECIMAL = getFullDecimalMultiplier(18)
