import { getBestTrade } from './getBestTrade'
import {
  createPoolProvider,
  createQuoteProvider,
  createStaticPoolProvider,
  createOffChainQuoteProvider,
} from './providers'
import {
  getExecutionPrice,
  maximumAmountIn,
  minimumAmountOut,
  isV2Pool,
  isV3Pool,
  isStablePool,
  getMidPrice,
} from './utils'
import { getPairCombinations } from './functions'

export const SmartRouter = {
  getBestTrade,
  createPoolProvider,
  createQuoteProvider,
  createOffChainQuoteProvider,
  getExecutionPrice,
  createStaticPoolProvider,
  getPairCombinations,
  maximumAmountIn,
  minimumAmountOut,
  isV3Pool,
  isV2Pool,
  isStablePool,
  getMidPrice,
}
