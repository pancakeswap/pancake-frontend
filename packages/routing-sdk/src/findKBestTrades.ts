import { TradeType } from '@pancakeswap/swap-sdk-core'
import { findBestTrade, type FindBestTradeParams } from './findBestTrade'
import { TradeWithGraph } from './types'
import { isTradeBetter } from './utils'

export type FindKBestTradesParams = FindBestTradeParams & {
  top: number
}

export async function findKBestTrades({
  top,
  ...params
}: FindKBestTradesParams): Promise<TradeWithGraph<TradeType>[] | undefined> {
  const best = await findBestTrade(params)
  if (!best) {
    return undefined
  }

  const trades: TradeWithGraph<TradeType>[] = [best]
  const potentialTrades: TradeWithGraph<TradeType>[] = []
  const { candidatePools } = params

  for (let i = 0; i < top - 1; i += 1) {
    const { pools, path } = getBestRoute(trades[i])
    for (let j = 0; j < path.length - 1; j += 1) {
      const rootPath = j === 0 ? [] : pools.slice(0, j)
      const edgeToRemove = new Set<string>()
      const getPoolsToRoute = () => candidatePools.filter((p) => !edgeToRemove.has(p.getId()))
      for (const trade of trades) {
        const route = getBestRoute(trade)
        if (
          !rootPath.length ||
          (route.pools[j] && rootPath.every((edge, index) => edge.getId() === route.pools[index]?.getId()))
        ) {
          edgeToRemove.add(route.pools[j].getId())
        }
      }
      if (edgeToRemove.size === 0) {
        continue
      }

      try {
        // eslint-disable-next-line no-await-in-loop
        const trade = await findBestTrade({ ...params, candidatePools: getPoolsToRoute() })
        if (trade) {
          potentialTrades.push(trade)
        }
      } catch (e) {
        console.error('Fail to find potential trade', e)
      }
    }

    if (!potentialTrades.length) {
      break
    }
    potentialTrades.sort((a, b) => (isTradeBetter(a, b) ? -1 : 1))
    trades.push(potentialTrades.shift()!)
  }

  return trades
}

function getBestRoute({ routes }: Pick<TradeWithGraph<TradeType>, 'routes'>) {
  return routes.sort((r1, r2) => r2.percent - r1.percent)[0]
}
