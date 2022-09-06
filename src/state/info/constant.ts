import { infoClient, infoClientETH } from 'utils/graphql'
import { INFO_CLIENT, INFO_CLIENT_ETH } from 'config/constants/endpoints'
import { ChainId } from '@pancakeswap/sdk'

export type MultiChianName = 'BSC' | 'ETH'

export const multiChainQueryMainToken = {
  BSC: 'BNB',
  ETH: 'ETH',
}

export const multiChainId = {
  BSC: ChainId.BSC,
  ETH: ChainId.ETHEREUM,
}

export const multiChainQueryClient = {
  BSC: infoClient,
  ETH: infoClientETH,
}

export const multiChainQueryEndPoint = {
  BSC: INFO_CLIENT,
  ETH: INFO_CLIENT_ETH,
}
