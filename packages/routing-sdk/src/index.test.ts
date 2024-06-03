import { expect, test } from 'vitest'
import * as exportedNameSpaces from './index'

test('exports', () => {
  expect(Object.keys(exportedNameSpaces)).toMatchInlineSnapshot(`
    [
      "getNeighbour",
      "getEdgeKey",
      "createGraph",
      "createPriceCalculator",
    ]
  `)
})
