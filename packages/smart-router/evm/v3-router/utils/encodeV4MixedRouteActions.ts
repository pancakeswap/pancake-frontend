import { Hex, bytesToHex } from 'viem'

import { BaseRoute, V4MixedQuoterActions } from '../types'
import { isStablePool, isV2Pool, isV3Pool, isV4BinPool, isV4ClPool } from './pool'

export function encodeV4MixedRouteActions(route: BaseRoute): Hex {
  return bytesToHex(
    new Uint8Array(
      route.pools.map((p) => {
        if (isV2Pool(p)) {
          return V4MixedQuoterActions.V2_EXACT_INPUT_SINGLE
        }
        if (isV3Pool(p)) {
          return V4MixedQuoterActions.V3_EXACT_INPUT_SINGLE
        }
        if (isStablePool(p)) {
          return V4MixedQuoterActions.SS_2_EXACT_INPUT_SINGLE
        }
        if (isV4ClPool(p)) {
          return V4MixedQuoterActions.V4_CL_EXACT_INPUT_SINGLE
        }
        if (isV4BinPool(p)) {
          return V4MixedQuoterActions.V4_BIN_EXACT_INPUT_SINGLE
        }
        throw new Error(`Unrecognized pool type ${p}`)
      }),
    ),
  )
}
