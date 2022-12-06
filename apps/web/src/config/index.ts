import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'

export const BITGERT_BLOCK_TIME = 15

// ICE_PER_BLOCK details
// 40 ICE is minted per block
// 20 ICE per block is sent to Burn pool (A farm just for burning cake)
// 10 ICE per block goes to ICE syrup pool
// 9 ICE per block goes to Yield farms and lottery
// ICE_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// ICE/Block in src/views/Home/components/CakeDataRow.tsx = 15 (40 - Amount sent to burn pool)
export const ICE_PER_BLOCK = 40
export const BLOCKS_PER_DAY = (60 / BITGERT_BLOCK_TIME) * 60 * 24
export const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365 // 10512000
export const ICE_PER_YEAR = ICE_PER_BLOCK * BLOCKS_PER_YEAR
export const BASE_URL = 'https://icecreamswap.com'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const DEFAULT_TOKEN_DECIMAL = getFullDecimalMultiplier(18)
export const DEFAULT_GAS_LIMIT = 250000
export const BOOSTED_FARM_GAS_LIMIT = 500000
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
