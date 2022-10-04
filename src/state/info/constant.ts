import { infoClient, infoClientETH, infoStableSwapClient } from 'utils/graphql'
import { INFO_CLIENT, INFO_CLIENT_ETH } from 'config/constants/endpoints'
import { ChainId } from '@pancakeswap/sdk'
import { PCS_V2_START, PCS_ETH_START } from 'config/constants/info'

export type MultiChainName = 'BSC' | 'ETH'

export const multiChainQueryMainToken = {
  BSC: 'BNB',
  ETH: 'ETH',
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

export const multiChainQueryEndPoint = {
  BSC: INFO_CLIENT,
  ETH: INFO_CLIENT_ETH,
}

export const multiChainScan = {
  BSC: 'View on BscScan',
  ETH: 'View on Etherscan',
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainName) => {
  const isStableSwap = window.location.href.includes('stableSwap')
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
