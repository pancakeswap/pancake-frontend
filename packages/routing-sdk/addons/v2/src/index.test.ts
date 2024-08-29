import { expect, test } from 'vitest'
import * as exportedNameSpaces from './index'

test('exports', () => {
  expect(Object.keys(exportedNameSpaces)).toMatchInlineSnapshot(`
    [
      "V2_POOL_TYPE",
      "COST_PER_EXTRA_HOP_STABLE_SWAP",
      "BASE_SWAP_COST_V2",
      "COST_PER_EXTRA_HOP_V2",
      "toSerializableV2Pool",
      "parseV2Pool",
      "createV2Pool",
      "isV2Pool",
    ]
  `)
})
