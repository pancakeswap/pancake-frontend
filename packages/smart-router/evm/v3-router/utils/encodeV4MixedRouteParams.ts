import { PoolKey, encodePoolKey } from '@pancakeswap/v4-sdk'
import { getCurrencyAddress } from '@pancakeswap/swap-sdk-core'
import { Hex, encodeAbiParameters, parseAbiParameters } from 'viem'

import { BaseRoute } from '../types'
import { isStablePool, isV2Pool, isV3Pool, isV4BinPool, isV4ClPool } from './pool'

const v4RouteParamsAbi = [
  {
    components: [
      {
        components: [
          { name: 'currency0', type: 'address' },
          { name: 'currency1', type: 'address' },
          { name: 'hooks', type: 'address' },
          { name: 'poolManager', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'parameters', type: 'bytes32' },
        ],
        name: 'poolKey',
        type: 'tuple',
      },
      { name: 'hookData', type: 'bytes' },
    ],
    name: 'params',
    type: 'tuple',
  },
] as const

export function encodeV4MixedRouteParams(route: BaseRoute): Hex[] {
  return route.pools.map((p) => {
    if (isV2Pool(p) || isStablePool(p)) {
      return '0x'
    }
    if (isV3Pool(p)) {
      return encodeAbiParameters(parseAbiParameters('uint24'), [p.fee])
    }
    if (isV4ClPool(p)) {
      const poolKey: PoolKey<'CL'> = {
        currency0: getCurrencyAddress(p.currency0),
        currency1: getCurrencyAddress(p.currency1),
        fee: p.fee,
        hooks: p.hooks,
        poolManager: p.poolManager,
        parameters: {
          tickSpacing: p.tickSpacing,
        },
      }
      return encodeAbiParameters(v4RouteParamsAbi, [
        {
          poolKey: encodePoolKey(poolKey),
          hookData: '0x',
        },
      ])
    }
    if (isV4BinPool(p)) {
      const poolKey: PoolKey<'Bin'> = {
        currency0: getCurrencyAddress(p.currency0),
        currency1: getCurrencyAddress(p.currency1),
        fee: p.fee,
        hooks: p.hooks,
        poolManager: p.poolManager,
        parameters: {
          binStep: Number(p.binStep),
        },
      }
      return encodeAbiParameters(v4RouteParamsAbi, [
        {
          poolKey: encodePoolKey(poolKey),
          hookData: '0x',
        },
      ])
    }
    throw new Error(`Invalid pool type ${p}`)
  })
}
