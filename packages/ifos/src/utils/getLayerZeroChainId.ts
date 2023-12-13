import { ChainId } from '@pancakeswap/sdk'

import { LZ_CHAIN_MAP, LZ_MAP_REVERSE } from '../constants/lzChainMap'

export function getLayerZeroChainId(chainId: ChainId): number {
  const lzChainId = (LZ_CHAIN_MAP as Record<ChainId, number>)[chainId]

  if (lzChainId === undefined) {
    throw new Error(
      `Chain ${chainId} not supported on LayerZero network. See https://layerzero.gitbook.io/docs/technical-reference/mainnet/supported-chain-ids for more information`,
    )
  }
  return lzChainId
}

export function getChainIdByLZChainId(lzChainId: number): ChainId {
  const chainId = LZ_MAP_REVERSE[lzChainId]
  if (chainId === undefined) {
    throw new Error(`Cannot find corresponding layerzero chain ${lzChainId}.`)
  }
  return chainId
}
