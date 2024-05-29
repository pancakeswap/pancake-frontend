import { expect, test } from 'vitest'
import * as exports from './index'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "FACTORY_ADDRESS",
      "FACTORY_ADDRESS_MAP",
      "INIT_CODE_HASH",
      "INIT_CODE_HASH_MAP",
      "computePairAddress",
      "Pair",
      "Route",
      "inputOutputComparator",
      "tradeComparator",
      "Trade",
      "pancakePairV2ABI",
      "Router",
      "Fetcher",
      "isTradeBetter",
    ]
  `)
})
