import { getBestTrade } from './getBestTrade'
import { createPoolProvider, createQuoteProvider, createStaticPoolProvider } from './providers'
import { getExecutionPrice } from './utils'
import { getPairCombinations } from './functions'

export const SmartRouter = {
  getBestTrade,
  createPoolProvider,
  createQuoteProvider,
  getExecutionPrice,
  createStaticPoolProvider,
  getPairCombinations,
}
