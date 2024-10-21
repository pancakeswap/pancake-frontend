import { RoutePlanner } from '../utils/RoutePlanner'

export type TradeConfig = {
  allowRevert: boolean
}

export enum RouterTradeType {
  PancakeSwapTrade = 'PancakeSwapTrade',
  // NFTTrade = 'NFTTrade',
  UnwrapWETH = 'UnwrapWETH',
}

// interface for entities that can be encoded as a Universal Router command
export interface Command {
  tradeType: RouterTradeType
  encode(planner: RoutePlanner, config: TradeConfig): void
}
