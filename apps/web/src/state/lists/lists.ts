import { createListsAtom, createTokenListReducer, NEW_LIST_STATE } from '@pancakeswap/token-lists/react'
import { DEFAULT_ACTIVE_LIST_URLS, DEFAULT_LIST_OF_LISTS, UNSUPPORTED_LIST_URLS } from 'config/constants/lists'

export const initialState = {
  lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
  byUrl: {
    ...DEFAULT_LIST_OF_LISTS.concat(...UNSUPPORTED_LIST_URLS).reduce((memo, listUrl) => {
      memo[listUrl] = NEW_LIST_STATE
      return memo
    }, {}),
  },
  activeListUrls: DEFAULT_ACTIVE_LIST_URLS,
}

const listReducer = createTokenListReducer(initialState, DEFAULT_LIST_OF_LISTS, DEFAULT_ACTIVE_LIST_URLS)

export const { listsAtom, useListState, useListStateReady } = createListsAtom('listv4', listReducer, initialState)
