import { getAllCommonPairs } from './getAllCommonPairs'
import { getBestTradeExactIn, getBestTradeExactOut } from './getBestTrade'
import { stableSwapPairsByChainId } from './getStableSwapPairs'
import { isStableSwapPair } from './utils/pair'
import { createStableSwapPair } from './stableSwap'
import { RouteType } from './types'

export const LegacyRouter = {
  getAllCommonPairs,
  getBestTradeExactOut,
  getBestTradeExactIn,
  isStableSwapPair,
  createStableSwapPair,
  stableSwapPairsByChainId,
}

export { Trade as LegacyTrade } from './trade'

export { Route as LegacyRoute } from './route'

export type {
  TradeWithStableSwap as LegacyTradeWithStableSwap,
  Pair as LegacyPair,
  StableSwapPair as LegacyStableSwapPair,
} from './types'

export { RouteType as LegacyRouteType }
