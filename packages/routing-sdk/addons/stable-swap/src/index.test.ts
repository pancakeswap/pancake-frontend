import { expect, test } from 'vitest'
import * as exportedNameSpaces from './index'

test('exports', () => {
  expect(Object.keys(exportedNameSpaces)).toMatchInlineSnapshot(`
    [
      "STABLE_POOL_TYPE",
      "BASE_SWAP_COST_STABLE_SWAP",
      "COST_PER_EXTRA_HOP_STABLE_SWAP",
      "toSerializableStablePool",
      "parseStablePool",
      "createStablePool",
      "isStablePool",
    ]
  `)
})
