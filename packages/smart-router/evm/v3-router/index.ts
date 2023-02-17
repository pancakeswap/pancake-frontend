import { getBestTrade } from './getBestTrade'
import { createPoolProvider, createQuoteProvider } from './providers'
import { getExecutionPrice } from './utils'

export const SmartRouter = {
  getBestTrade,
  createPoolProvider,
  createQuoteProvider,
  getExecutionPrice,
}
