import { ChainId } from '@pancakeswap/sdk'

import { LZ_CHAIN_MAP } from '../constants/lzChainMap'

export function getLayerZeroChainId(chainId: ChainId): number | undefined {
  return (LZ_CHAIN_MAP as Record<ChainId, number>)[chainId]
}
