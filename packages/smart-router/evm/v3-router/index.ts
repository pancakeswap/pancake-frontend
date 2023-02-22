import { getBestTrade } from './getBestTrade'
import {
  createPoolProvider,
  createQuoteProvider,
  createStaticPoolProvider,
  createOffChainQuoteProvider,
  getV2PoolsOnChain,
  getStablePoolsOnChain,
} from './providers'
import {
  getExecutionPrice,
  maximumAmountIn,
  minimumAmountOut,
  isV2Pool,
  isV3Pool,
  isStablePool,
  getMidPrice,
  involvesCurrency,
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
  involvesCurrency,
  getV2PoolsOnChain,
  getStablePoolsOnChain,
}
