import { Percent, ChainId } from '@pancakeswap/sdk'

export const BIG_INT_TEN = 10n
// one basis point
export const BIPS_BASE = 10000n

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: bigint = BIG_INT_TEN ** 16n // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(50n, BIPS_BASE)

export const CHAIN_ID_TO_CHAIN_NAME = {
  [ChainId.BSC]: 'bsc',
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.GOERLI]: '',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.ARBITRUM_GOERLI]: '',
  [ChainId.POLYGON_ZKEVM]: 'polygon_zkevm',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '',
  [ChainId.ZKSYNC]: 'era',
  [ChainId.ZKSYNC_TESTNET]: '',
  [ChainId.LINEA_TESTNET]: '',
} satisfies Record<ChainId, string>
