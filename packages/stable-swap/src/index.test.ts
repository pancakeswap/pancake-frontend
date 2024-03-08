import { expect, test } from 'vitest'
import * as exportedNameSpaces from './index'

test('exports', () => {
  expect(Object.keys(exportedNameSpaces)).toMatchInlineSnapshot(`
    [
      "getQuoteExactIn",
      "getQuoteExactOut",
      "getSwapInput",
      "getSwapInputWithtouFee",
      "getSwapOutput",
      "getSwapOutputWithoutFee",
      "getLPOutputWithoutFee",
      "getLPOutput",
      "getD",
      "getStableSwapPools",
      "isStableSwapSupported",
      "STABLE_SUPPORTED_CHAIN_IDS",
      "ONE_HUNDRED_PERCENT",
    ]
  `)
})
