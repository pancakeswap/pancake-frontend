import { infoClientBITGERT, infoStableSwapClient } from 'utils/graphql'
import { INFO_CLIENT_BITGERT, BLOCKS_CLIENT_BITGERT } from 'config/constants/endpoints'
import { ChainId } from '@pancakeswap/sdk'
import { PCS_BITGERT_START } from 'config/constants/info'
import { GraphQLClient } from 'graphql-request'

export type MultiChainName = 'BSC' | 'BITGERT' | 'DOGECHAIN' | 'DOKEN' | 'FUSE' | 'XDC'

export const multiChainQueryMainToken = {
  BSC: 'BNB',
  BITGERT: 'ETH',
}

export const multiChainBlocksClient = {
  BITGERT: BLOCKS_CLIENT_BITGERT,
}

export const multiChainStartTime = {
  BITERT: PCS_BITGERT_START,
}

export const multiChainId = {
  BITGERT: ChainId.BITGERT,
}

export const multiChainPaths = {
  [ChainId.BITGERT]: '',
}

// @ts-ignore fix missing queryClients
export const multiChainQueryClient: Record<MultiChainName, GraphQLClient> = {
  BITGERT: infoClientBITGERT,
}

export const multiChainQueryEndPoint = {
  BITGERT: INFO_CLIENT_BITGERT,
}

export const multiChainScan = {
  BITGERT: 'BriseScan',
  DOGECHAIN: 'DogeScan',
  DOKEN: 'DokenScan',
  FUSE: 'FuseScan',
}

export const multiChainTokenBlackList = {
  // BSC: TOKEN_BLACKLIST,
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainName) => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
