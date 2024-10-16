import { type Pool, type Route, type Trade, toSerializableTrade } from '@pancakeswap/routing-sdk'
import { createStablePool, isStablePool, toSerializableStablePool } from '@pancakeswap/routing-sdk-addon-stable-swap'
import { createV2Pool, isV2Pool, toSerializableV2Pool } from '@pancakeswap/routing-sdk-addon-v2'
import { createV3Pool, isV3Pool, toSerializableV3Pool } from '@pancakeswap/routing-sdk-addon-v3'
import {
  type V4Router,
  getRouteTypeByPools,
  PoolType,
  SmartRouter,
  Pool as SmartRouterPool,
} from '@pancakeswap/smart-router'
import type { TradeType } from '@pancakeswap/swap-sdk-core'

export function toRoutingSDKPool(p: SmartRouterPool): Pool {
  if (SmartRouter.isV3Pool(p)) {
    return createV3Pool(p)
  }
  if (SmartRouter.isV2Pool(p)) {
    return createV2Pool(p)
  }
  if (SmartRouter.isStablePool(p)) {
    return createStablePool(p)
  }
  throw new Error(`Unsupported pool type: ${p.type}`)
}

export function toSmartRouterPool(p: any): SmartRouterPool {
  if (isV3Pool(p)) {
    return {
      ...p.getPoolData(),
      type: PoolType.V3,
    }
  }
  if (isV2Pool(p)) {
    return {
      ...p.getPoolData(),
      type: PoolType.V2,
    }
  }
  if (isStablePool(p)) {
    return {
      ...p.getPoolData(),
      type: PoolType.STABLE,
    }
  }
  throw new Error('Unrecognized pool type')
}

export function toRoutingSDKTrade(v4Trade: V4Router.V4TradeWithoutGraph<TradeType>): Trade<TradeType> {
  return {
    ...v4Trade,
    routes: v4Trade.routes.map((r) => ({
      ...r,
      pools: r.pools.map(toRoutingSDKPool),
    })),
  }
}

export function toV4Trade(trade: Trade<TradeType>): V4Router.V4TradeWithoutGraph<TradeType> {
  return {
    ...trade,
    routes: trade.routes.map(toV4Route),
  }
}

export function toV4Route(route: Route): V4Router.V4Route {
  const pools = route.pools.map(toSmartRouterPool)
  return {
    ...route,
    pools,
    type: getRouteTypeByPools(pools),
  }
}

export function toSerializableV4Trade(trade: Trade<TradeType>): V4Router.Transformer.SerializedV4Trade {
  const serializableTrade = toSerializableTrade(trade, {
    toSerializablePool: (p) => {
      if (isV3Pool(p)) {
        return {
          ...toSerializableV3Pool(p),
          type: PoolType.V3,
        }
      }
      if (isV2Pool(p)) {
        return {
          ...toSerializableV2Pool(p),
          type: PoolType.V2,
        }
      }
      if (isStablePool(p)) {
        return {
          ...toSerializableStablePool(p),
          type: PoolType.STABLE,
        }
      }
      throw new Error('Unknown pool type')
    },
  })
  return {
    ...serializableTrade,
    routes: serializableTrade.routes.map((r) => ({
      ...r,
      type: getRouteTypeByPools(r.pools),
    })),
  }
}
