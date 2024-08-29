import { expect, test } from 'vitest'
import * as exportedNameSpaces from './index'

test('exports', () => {
  expect(Object.keys(exportedNameSpaces)).toMatchInlineSnapshot(`
    [
      "getNeighbour",
      "getEdgeKey",
      "createGraph",
      "createPriceCalculator",
      "findBestTrade",
      "findBestTradeByStreams",
      "isSameRoute",
      "mergeRoute",
      "isTradeBetter",
      "getBetterTrade",
      "groupPoolsByType",
      "logCurrency",
      "toSerializableCurrency",
      "toSerializableCurrencyAmount",
      "toSerializableRoute",
      "toSerializableTrade",
      "parseCurrency",
      "parseCurrencyAmount",
      "parseRoute",
      "parseTrade",
      "getPriceImpact",
      "getMidPrice",
      "ADDRESS_ZERO",
      "findKBestTrades",
    ]
  `)
})
