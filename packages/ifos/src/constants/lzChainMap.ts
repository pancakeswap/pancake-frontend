import { ChainId } from '@pancakeswap/chains'

// @see https://layerzero.gitbook.io/docs/technical-reference/mainnet/supported-chain-ids
export const LZ_CHAIN_MAP = {
  [ChainId.ETHEREUM]: 101,
  [ChainId.BSC]: 102,
  [ChainId.POLYGON_ZKEVM]: 158,
  [ChainId.ZKSYNC]: 165,
  [ChainId.ARBITRUM_ONE]: 110,

  // Testnets
  [ChainId.BSC_TESTNET]: 10102,
  [ChainId.GOERLI]: 10121,
} as const

export const LZ_MAP_REVERSE = Object.keys(LZ_CHAIN_MAP).reduce<Record<number, ChainId>>(
  (acc, cur) => ({
    ...acc,
    [(LZ_CHAIN_MAP as Record<string, number>)[cur]]: Number(cur) as ChainId,
  }),
  {},
)
