import { ChainId } from '@pancakeswap/sdk'

export const SUPPORT_ONLY_BSC = [ChainId.BSC]
export const SUPPORT_FARMS = [
  ChainId.BSC,
  ChainId.BSC_TESTNET,
  ChainId.ETHEREUM,
  ChainId.GOERLI,
  ChainId.ZKSYNC_TESTNET,
  ChainId.POLYGON_ZKEVM_TESTNET,
  ChainId.POLYGON_ZKEVM,
  ChainId.ZKSYNC,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_GOERLI,
  ChainId.LINEA,
]
export const SUPPORT_BUY_CRYPTO = [
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.ARBITRUM_ONE,
  ChainId.ZKSYNC,
  ChainId.POLYGON_ZKEVM,
  ChainId.LINEA,
  ChainId.BASE
]
