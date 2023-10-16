import { expect, test } from 'vitest'
import * as exports from './index'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "WrappedTokenInfo",
      "deserializeToken",
      "VersionUpgrade",
      "getVersionUpgrade",
      "createFilterToken",
    ]
  `)
})
