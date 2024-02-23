import { createGraph, findBestTradeFromGraph } from './graph'
import { TradeConfig } from './types'

export function getBestTrade({ amount, candidatePools }: TradeConfig) {
  const graph = createGraph({ pools: candidatePools })
  const trade = findBestTradeFromGraph({
    amount,
    graph,
  })
  return trade
}
