import { ChainId } from '@pancakeswap/chains'
import { supportedChainId } from '@pancakeswap/farms'

export const SUPPORT_ONLY_BSC = [ChainId.BSC]
export const SUPPORT_FARMS = supportedChainId
export const SUPPORT_BUY_CRYPTO = [
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.ARBITRUM_ONE,
  ChainId.ZKSYNC, // NO PROVIDER SUPPORT ZK_SYNC_ERA
  ChainId.POLYGON_ZKEVM,
  ChainId.LINEA,
  ChainId.BASE,
]

export const LIQUID_STAKING_SUPPORTED_CHAINS = [
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.BSC_TESTNET,
  ChainId.ARBITRUM_GOERLI,
]
export const FIXED_STAKING_SUPPORTED_CHAINS = [ChainId.BSC]

export const V3_MIGRATION_SUPPORTED_CHAINS = [ChainId.BSC, ChainId.ETHEREUM]
