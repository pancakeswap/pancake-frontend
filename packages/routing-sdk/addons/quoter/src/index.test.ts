import { expect, test } from 'vitest'
import * as exportedNameSpaces from './index'

test('exports', () => {
  expect(Object.keys(exportedNameSpaces)).toMatchInlineSnapshot(`
    [
      "EMPTY_FEE_PATH_PLACEHOLDER",
      "MIXED_ROUTE_QUOTER_ADDRESSES",
      "V3_QUOTER_ADDRESSES",
      "encodeRouteToPath",
      "isMixedRoute",
      "isV3Route",
      "buildV3QuoteCall",
      "fetchV3Quote",
      "fetchQuotes",
    ]
  `)
})
