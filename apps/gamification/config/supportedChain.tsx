import { ChainId } from '@pancakeswap/chains'
import { arbitrum, base, bsc, mainnet as ethereum, linea, opBNB, polygonZkEvm, zkSync } from 'wagmi/chains'

export const targetChains = [ethereum, bsc, zkSync, arbitrum, base, linea, opBNB, polygonZkEvm]

export const SUPPORTED_CHAIN = [
  ChainId.ETHEREUM,
  ChainId.BSC,
  ChainId.ZKSYNC,
  ChainId.ARBITRUM_ONE,
  ChainId.BASE,
  ChainId.LINEA,
  ChainId.OPBNB,
  ChainId.POLYGON_ZKEVM,
]
