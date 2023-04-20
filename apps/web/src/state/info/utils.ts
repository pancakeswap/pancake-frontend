import { ChainId } from '@pancakeswap/sdk'

import { CHAIN_QUERY_NAME } from 'config/chains'

import { multiChainPaths } from './constant'

export function getTokenInfoPath(chainId: ChainId, address: string) {
  return `/info/v3${multiChainPaths[chainId]}/tokens/${address}?chain=${CHAIN_QUERY_NAME[chainId]}`
}
