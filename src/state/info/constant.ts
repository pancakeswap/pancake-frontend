import { infoClient, infoClientETH } from 'utils/graphql'

export const multiChainQueryMainToken = {
  BSC: 'BNB',
  ETH: 'ETH',
}

export const multiChainQueryClient = {
  BSC: infoClient,
  ETH: infoClientETH,
}
