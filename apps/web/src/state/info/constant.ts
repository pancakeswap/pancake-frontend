import {infoClient, infoClientBITGERT, infoStableSwapClient} from 'utils/graphql'
import {
  INFO_CLIENT,
  INFO_CLIENT_BITGERT,
  BLOCKS_CLIENT,
  BLOCKS_CLIENT_BITGERT,
} from 'config/constants/endpoints'
import { ChainId } from '@pancakeswap/sdk'
import {
  PCS_V2_START,
  PCS_BITGERT_START,
  ETH_TOKEN_BLACKLIST,
  TOKEN_BLACKLIST,
} from 'config/constants/info'

export type MultiChainName = 'BSC' | 'BITGERT' | 'DOGECHAIN' | 'DOKEN' | 'FUSE'

export const multiChainQueryMainToken = {
  BSC: 'BNB',
  BITGERT: 'ETH',
}

export const multiChainBlocksClient = {
  BSC: BLOCKS_CLIENT,
  BITGERT: BLOCKS_CLIENT_BITGERT
}

export const multiChainStartTime = {
  BSC: PCS_V2_START,
  BITERT: PCS_BITGERT_START,
}

export const multiChainId = {
  BSC: ChainId.BSC,
  BITGERT: ChainId.BITGERT,
}

export const multiChainPaths = {
  [ChainId.BSC]: '',
  [ChainId.BITGERT]: '',
}

export const multiChainQueryClient = {
  BSC: infoClient,
  BITGERT: infoClientBITGERT,
}

export const multiChainQueryEndPoint = {
  BSC: INFO_CLIENT,
  BITGERT: INFO_CLIENT_BITGERT,
}

export const multiChainScan = {
  BSC: 'BscScan',
  BITGERT: 'BriseScan',
  DOGECHAIN: "DogeScan",
  DOKEN: "DokenScan",
  FUSE: "FuseScan"
}

export const multiChainTokenBlackList = {
  BSC: TOKEN_BLACKLIST,
  ETH: ETH_TOKEN_BLACKLIST,
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainName) => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
