import { expect, test } from 'vitest'
import * as exports from './index'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "StableSwap",
      "SmartRouter",
      "SwapRouter",
      "Transformer",
      "PoolType",
      "RouteType",
      "getStableSwapPools",
      "isStableSwapSupported",
      "BIG_INT_TEN",
      "BIPS_BASE",
      "MIN_BNB",
      "BETTER_TRADE_LESS_HOPS_THRESHOLD",
      "CHAIN_ID_TO_CHAIN_NAME",
      "SMART_ROUTER_ADDRESSES",
      "V2_ROUTER_ADDRESS",
      "STABLE_SWAP_INFO_ADDRESS",
      "BASES_TO_CHECK_TRADES_AGAINST",
      "ADDITIONAL_BASES",
      "CUSTOM_BASES",
      "V2_FEE_PATH_PLACEHOLDER",
      "MSG_SENDER",
      "ADDRESS_THIS",
      "MIXED_ROUTE_QUOTER_ADDRESSES",
      "V3_QUOTER_ADDRESSES",
      "BASE_SWAP_COST_V2",
      "COST_PER_EXTRA_HOP_V2",
      "COST_PER_UNINIT_TICK",
      "BASE_SWAP_COST_V3",
      "COST_PER_INIT_TICK",
      "COST_PER_HOP_V3",
      "BASE_SWAP_COST_STABLE_SWAP",
      "COST_PER_EXTRA_HOP_STABLE_SWAP",
      "usdGasTokensByChain",
      "BATCH_MULTICALL_CONFIGS",
    ]
  `)
})
