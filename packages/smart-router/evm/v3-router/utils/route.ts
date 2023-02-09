import { Currency } from '@pancakeswap/sdk'

import { BaseRoute, Pool, RouteType, PoolType } from '../types'
import { getOutputCurrency } from './pool'

export function buildBaseRoute(pools: Pool[], currencyIn: Currency): BaseRoute {
  const path: Currency[] = [currencyIn.wrapped]
  let prevIn = path[0]
  let routeType: RouteType | null = null
  const updateRouteType = (pool: Pool, currentRouteType: RouteType | null) => {
    if (currentRouteType === null) {
      return getRouteTypeFromPool(pool)
    }
    if (currentRouteType === RouteType.MIXED || currentRouteType !== getRouteTypeFromPool(pool)) {
      return RouteType.MIXED
    }
    return currentRouteType
  }
  for (const pool of pools) {
    prevIn = getOutputCurrency(pool, prevIn)
    path.push(prevIn)
    routeType = updateRouteType(pool, routeType)
  }

  if (routeType === null) {
    throw new Error(`Invalid route type when constructing base route`)
  }

  return {
    path,
    pools,
    type: routeType,
  }
}

function getRouteTypeFromPool(pool: Pool) {
  switch (pool.type) {
    case PoolType.V2:
      return RouteType.V2
    case PoolType.V3:
      return RouteType.V3
    case PoolType.STABLE:
      return RouteType.STABLE
    default:
      return RouteType.MIXED
  }
}
