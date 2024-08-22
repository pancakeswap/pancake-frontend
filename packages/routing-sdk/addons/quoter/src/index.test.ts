import { expect, test } from 'vitest'
import * as exportedNameSpaces from './index'

test('exports', () => {
  expect(Object.keys(exportedNameSpaces)).toMatchInlineSnapshot(`
    [
      "EMPTY_FEE_PATH_PLACEHOLDER",
      "V3_QUOTER_ADDRESSES",
      "encodeRouteToPath",
      "fetchV3Quote",
    ]
  `)
})
