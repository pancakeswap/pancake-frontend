import { infoClient, infoClientETH, infoStableSwapClient, infoNRClient } from 'utils/graphql'
import {
  INFO_CLIENT,
  INFO_CLIENT_ETH,
  BLOCKS_CLIENT,
  BLOCKS_CLIENT_ETH,
  INFO_NR_CLIENT,
} from 'config/constants/endpoints'
import { ChainId } from '@pancakeswap/sdk'
import { PCS_V2_START, PCS_ETH_START, ETH_TOKEN_BLACKLIST, TOKEN_BLACKLIST } from 'config/constants/info'
import Cookies from 'js-cookie'

export type MultiChainName = 'BSC' | 'ETH'

export const multiChainQueryMainToken = {
  BSC: 'BNB',
  ETH: 'ETH',
}

export const multiChainBlocksClient = {
  BSC: BLOCKS_CLIENT,
  ETH: BLOCKS_CLIENT_ETH,
}

export const multiChainStartTime = {
  BSC: PCS_V2_START,
  ETH: PCS_ETH_START,
}

export const multiChainId = {
  BSC: ChainId.BSC,
  ETH: ChainId.ETHEREUM,
}

export const multiChainPaths = {
  [ChainId.BSC]: '',
  [ChainId.ETHEREUM]: '/eth',
}

export const multiChainQueryClient = {
  BSC: infoClient,
  ETH: infoClientETH,
}

export const multiChainQueryClientWithNR = {
  BSC: infoNRClient,
  ETH: infoClientETH,
}

export const multiChainQueryEndPoint = {
  BSC: INFO_CLIENT,
  ETH: INFO_CLIENT_ETH,
}

export const multiChainQueryEndPointWithNR = {
  BSC: INFO_NR_CLIENT,
  ETH: INFO_CLIENT_ETH,
}

export const multiChainScan = {
  BSC: 'BscScan',
  ETH: 'EtherScan',
}

export const multiChainTokenBlackList = {
  BSC: TOKEN_BLACKLIST,
  ETH: ETH_TOKEN_BLACKLIST,
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainName) => {
  const isStableSwap = checkIsStableSwap()
  const bucketInfo = Cookies.get('bucket-info-2') // sf or nr
  if (isStableSwap) return infoStableSwapClient
  return bucketInfo === 'sf' ? multiChainQueryClient[chainName] : multiChainQueryClientWithNR[chainName]
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
