import { expect, test } from 'vitest'
import * as exports from './index'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "ZERO_PERCENT",
      "ONE_HUNDRED_PERCENT",
      "WETH9",
      "WBNB",
      "WNATIVE",
      "NATIVE",
      "ERC20Token",
      "Native",
      "erc20Abi",
      "validateAndParseAddress",
      "Ether",
    ]
  `)
})
