import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'

export const DOMAIN = 'https://aptos.pancakeswap.finance'
export const BASE_ADD_LIQUIDITY_URL = `${DOMAIN}/add`

export const APEX_DOMAIN = process.env.NEXT_PUBLIC_APEX_URL

export const ASSETS_CDN = 'https://assets.pancakeswap.finance'

export const CHECK_USER_IP_API = 'https://check-api.pancakeswap.com/api/apt-check'

export const LOW_APT = 0.1
export const DEFAULT_TOKEN_DECIMAL = getFullDecimalMultiplier(18)
export const FARMS_DEFAULT_TOKEN_DECIMAL = getFullDecimalMultiplier(8)

export const SECONDS_IN_YEAR = 31536000 // 365 * 24 * 60 * 60
