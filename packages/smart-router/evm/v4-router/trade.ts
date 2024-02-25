import { createGraph, findBestTradeFromGraph } from './graph'
import { TradeConfig } from './types'

export async function getBestTrade({ amount, candidatePools, quoteCurrency, gasPriceWei }: TradeConfig) {
  const graph = createGraph({ pools: candidatePools })
  const trade = await findBestTradeFromGraph({
    amount,
    graph,
    quoteCurrency,
    gasPriceWei,
  })
  return trade
}
