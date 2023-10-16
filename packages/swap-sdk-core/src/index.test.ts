import { expect, test } from 'vitest'
import * as exports from './index'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "TradeType",
      "Rounding",
      "MINIMUM_LIQUIDITY",
      "ZERO",
      "ONE",
      "TWO",
      "THREE",
      "FIVE",
      "TEN",
      "_100",
      "_9975",
      "_10000",
      "MaxUint256",
      "VMType",
      "VM_TYPE_MAXIMA",
      "BaseCurrency",
      "Fraction",
      "Percent",
      "CurrencyAmount",
      "Price",
      "NativeCurrency",
      "Token",
      "InsufficientReservesError",
      "InsufficientInputAmountError",
      "validateVMTypeInstance",
      "sqrt",
      "sortedInsert",
      "computePriceImpact",
      "getTokenComparator",
    ]
  `)
})
