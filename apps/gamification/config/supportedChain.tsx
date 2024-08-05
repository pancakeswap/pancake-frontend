import { ChainId } from '@pancakeswap/chains'
import {
  arbitrum,
  base,
  bsc,
  mainnet as ethereum,
  polygonZkEvm,
  // linea,
  // opBNB,
  zkSync,
} from 'wagmi/chains'

export const SUPPORT_ONLY_BSC = [ChainId.BSC]

export const targetChains = [
  ethereum,
  bsc,
  zkSync,
  arbitrum,
  polygonZkEvm,
  base,
  // linea,
  // opBNB,
]

export const SUPPORTED_CHAIN = [
  ChainId.ETHEREUM,
  ChainId.BSC,
  ChainId.ZKSYNC,
  ChainId.ARBITRUM_ONE,
  ChainId.BASE,
  ChainId.LINEA,
  // ChainId.OPBNB,
  // ChainId.POLYGON_ZKEVM,
]
