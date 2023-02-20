import { getBestTrade } from './getBestTrade'
import {
  createPoolProvider,
  createQuoteProvider,
  createStaticPoolProvider,
  createOffChainQuoteProvider,
} from './providers'
import { getExecutionPrice } from './utils'
import { getPairCombinations } from './functions'

export const SmartRouter = {
  getBestTrade,
  createPoolProvider,
  createQuoteProvider,
  createOffChainQuoteProvider,
  getExecutionPrice,
  createStaticPoolProvider,
  getPairCombinations,
}
