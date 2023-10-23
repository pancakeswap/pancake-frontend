import { ChainId } from '@pancakeswap/chains'

export const SUPPORTED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.BSC,
  ChainId.LINEA_TESTNET,
  ChainId.POLYGON_ZKEVM,
  ChainId.ZKSYNC,
  ChainId.BSC_TESTNET,
  ChainId.GOERLI,
  ChainId.ARBITRUM_ONE,
  ChainId.SCROLL_SEPOLIA,
  ChainId.BASE,
  ChainId.BASE_TESTNET,
  ChainId.LINEA,
  ChainId.OPBNB,
] as const

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]
