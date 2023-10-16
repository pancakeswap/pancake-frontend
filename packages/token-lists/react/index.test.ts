import { expect, test } from 'vitest'
import * as exports from './index'

test('exports', () => {
  expect(Object.keys(exports)).toMatchInlineSnapshot(`
    [
      "NEW_LIST_STATE",
      "createTokenListReducer",
      "fetchTokenList",
      "addList",
      "removeList",
      "enableList",
      "disableList",
      "acceptListUpdate",
      "rejectVersionUpdate",
      "updateListVersion",
      "createListsAtom",
      "useFetchListCallback",
    ]
  `)
})
