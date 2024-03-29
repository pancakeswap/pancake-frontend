import { ChainId } from '@pancakeswap/chains'

export const SUPPORTED_CHAIN_IDS = [
  ChainId.BSC,
  ChainId.BSC_TESTNET,
  ChainId.ETHEREUM,
  ChainId.ARBITRUM_ONE,
  ChainId.BASE,
  ChainId.POLYGON_ZKEVM,
  ChainId.ZKSYNC,
] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]
