import { createGraph, findBestTradeFromGraph } from './graph'
import { TradeConfig } from './types'

export async function getBestTrade({ amount, candidatePools, quoteCurrency }: TradeConfig) {
  const graph = createGraph({ pools: candidatePools })
  const trade = await findBestTradeFromGraph({
    amount,
    graph,
    quoteCurrency,
  })
  return trade
}
