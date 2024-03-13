import { ChainId } from '@pancakeswap/chains'

import { CHAIN_QUERY_NAME } from 'config/chains'

import { multiChainPaths } from './constant'
import { InfoDataSource } from './types'

// TODO: refactor
// Params should be defined in object for future extension
export function getTokenInfoPath(
  chainId: ChainId | undefined,
  address: string,
  dataSource: InfoDataSource = InfoDataSource.V3,
  stableSwapPath = '',
) {
  return `/info${dataSource === InfoDataSource.V3 ? '/v3' : ''}${
    multiChainPaths[chainId ?? '']
  }/tokens/${address}?chain=${CHAIN_QUERY_NAME[chainId ?? '']}${stableSwapPath.replace('?', '&')}`
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
