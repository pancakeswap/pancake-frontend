import { ChainId } from '@pancakeswap/chains'

export const SUPPORTED_CHAIN_IDS = [
  ChainId.BSC,
  ChainId.BSC_TESTNET,
  ChainId.ETHEREUM,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_GOERLI,
  ChainId.ZKSYNC,
  ChainId.ZKSYNC_TESTNET,
  ChainId.LINEA_TESTNET,
  ChainId.BASE_TESTNET,
  ChainId.POLYGON_ZKEVM_TESTNET,
  ChainId.OPBNB,
] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export const CAKE_VAULT_SUPPORTED_CHAINS = [ChainId.BSC, ChainId.BSC_TESTNET] as const

export type CakeVaultSupportedChainId = (typeof CAKE_VAULT_SUPPORTED_CHAINS)[number]
