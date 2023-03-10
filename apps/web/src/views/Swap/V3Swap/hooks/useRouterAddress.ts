import { TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade, RouteType, SWAP_ROUTER_ADDRESSES } from '@pancakeswap/smart-router/evm'

import { ROUTER_ADDRESS } from 'config/constants/exchange'

export function useRouterAddress(trade?: SmartRouterTrade<TradeType>) {
  if (!trade) {
    return ''
  }

  const { routes, inputAmount } = trade
  const {
    currency: { chainId },
  } = inputAmount
  if (routes.length === 1 && routes[0].type === RouteType.V2) {
    return ROUTER_ADDRESS[chainId]
  }
  return SWAP_ROUTER_ADDRESSES[chainId]
}
