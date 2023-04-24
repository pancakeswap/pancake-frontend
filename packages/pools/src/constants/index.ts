export * from './pools'
export * from './contracts'
export * from './supportedChains'

export const BSC_BLOCK_TIME = 3

export const BLOCKS_PER_DAY = (60 / BSC_BLOCK_TIME) * 60 * 24
export const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365 // 10512000

export const SECONDS_IN_YEAR = 31536000 // 365 * 24 * 60 * 60
