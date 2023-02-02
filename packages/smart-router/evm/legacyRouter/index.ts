import { getAllCommonPairs } from './getAllCommonPairs'
import { getBestTradeExactIn, getBestTradeExactOut } from './getBestTrade'
import { isStableSwapPair } from './utils/pair'
import { createStableSwapPair } from './stableSwap'

export const LegacyRouter = {
  getAllCommonPairs,
  getBestTradeExactOut,
  getBestTradeExactIn,
  isStableSwapPair,
  createStableSwapPair,
}

export { Trade as LegacyTrade } from './trade'

export { Route as LegacyRoute } from './route'

export type {
  TradeWithStableSwap as LegacyTradeWithStableSwap,
  RouteType as LegacyRouteType,
  Pair as LegacyPair,
  StableSwapPair as LegacyStableSwapPair,
} from './types'
