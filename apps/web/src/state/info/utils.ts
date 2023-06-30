import { ChainId } from '@pancakeswap/sdk'

import { CHAIN_QUERY_NAME } from 'config/chains'

import { multiChainPaths } from './constant'

export function getTokenInfoPath(chainId: ChainId, address: string) {
  return `/info/v3${multiChainPaths[chainId]}/tokens/${address}?chain=${CHAIN_QUERY_NAME[chainId]}`
}

// TODO: refactor
export function getChainName(chainId: ChainId) {
  switch (chainId) {
    case ChainId.BSC:
      return 'BSC'
    case ChainId.ETHEREUM:
      return 'ETH'
    default:
      return 'BSC'
  }
}
