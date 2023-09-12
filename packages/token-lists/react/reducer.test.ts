import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit'

import { fetchTokenList, acceptListUpdate, addList, removeList, enableList, updateListVersion } from './actions'
import { ListsState, createTokenListReducer, NEW_LIST_STATE, type ListByUrlState } from './reducer'

const DEFAULT_ACTIVE_LIST_URLS: string[] = []
const DEFAULT_LIST_OF_LISTS = ['https://tokens.pancakeswap.finance/pancakeswap-extended.json']
const STUB_TOKEN_LIST = {
  name: '',
  timestamp: '',
  version: { major: 1, minor: 1, patch: 1 },
  tokens: [],
}

const UNSUPPORTED_LIST_URLS: string[] = []

const reducer = createTokenListReducer(
  {
    lastInitializedDefaultListOfLists: DEFAULT_LIST_OF_LISTS,
    byUrl: {
      ...DEFAULT_LIST_OF_LISTS.concat(...UNSUPPORTED_LIST_URLS).reduce((memo, listUrl) => {
        memo[listUrl] = NEW_LIST_STATE
        return memo
      }, {} as Record<string, ListByUrlState>),
    },
    activeListUrls: DEFAULT_ACTIVE_LIST_URLS,
  },
  DEFAULT_LIST_OF_LISTS,
  DEFAULT_ACTIVE_LIST_URLS,
)

const PATCHED_STUB_LIST = {
  ...STUB_TOKEN_LIST,
  version: { ...STUB_TOKEN_LIST.version, patch: STUB_TOKEN_LIST.version.patch + 1 },
}
const MINOR_UPDATED_STUB_LIST = {
  ...STUB_TOKEN_LIST,
  version: { ...STUB_TOKEN_LIST.version, minor: STUB_TOKEN_LIST.version.minor + 1 },
}
const MAJOR_UPDATED_STUB_LIST = {
  ...STUB_TOKEN_LIST,
  version: { ...STUB_TOKEN_LIST.version, major: STUB_TOKEN_LIST.version.major + 1 },
}

const resetStore = (preloadedState?: ListsState) => {
  return configureStore({ reducer, preloadedState })
}

describe('list reducer', () => {
  let store: EnhancedStore<ListsState> = resetStore()

  beforeEach(() => {
    store = resetStore({
      byUrl: {
        'fake-url': {
          error: null,
          current: STUB_TOKEN_LIST,
          pendingUpdate: null,
          loadingRequestId: null,
        },
      },
      activeListUrls: undefined,
    })
  })

  describe('fetchTokenList', () => {
    describe('pending', () => {
      it('sets pending', () => {
        store.dispatch(fetchTokenList.pending({ requestId: 'request-id', url: 'fake-url' }))
        expect(store.getState()).toEqual({
          byUrl: {
            'fake-url': {
              error: null,
              loadingRequestId: 'request-id',
              current: STUB_TOKEN_LIST,
              pendingUpdate: null,
            },
          },
          selectedListUrl: undefined,
        })
      })

      it('does not clear current list', () => {
        store = resetStore({
          byUrl: {
            'fake-url': {
              error: null,
              current: STUB_TOKEN_LIST,
              pendingUpdate: null,
              loadingRequestId: null,
            },
          },
          activeListUrls: undefined,
        })

        store.dispatch(fetchTokenList.pending({ requestId: 'request-id', url: 'fake-url' }))
        expect(store.getState()).toEqual({
          byUrl: {
            'fake-url': {
              error: null,
              current: STUB_TOKEN_LIST,
              loadingRequestId: 'request-id',
              pendingUpdate: null,
            },
          },
          activeListUrls: undefined,
        })
      })
    })

    describe('fulfilled', () => {
      it('saves the list', () => {
        store.dispatch(
          fetchTokenList.fulfilled({ tokenList: STUB_TOKEN_LIST, requestId: 'request-id', url: 'fake-url' }),
        )
        expect(store.getState()).toEqual({
          byUrl: {
            'fake-url': {
              error: null,
              current: STUB_TOKEN_LIST,
              loadingRequestId: null,
              pendingUpdate: null,
            },
          },
          activeListUrls: undefined,
        })
      })

      it('does not save the list in pending if current is same', () => {
        store.dispatch(
          fetchTokenList.fulfilled({ tokenList: STUB_TOKEN_LIST, requestId: 'request-id', url: 'fake-url' }),
        )
        store.dispatch(
          fetchTokenList.fulfilled({ tokenList: STUB_TOKEN_LIST, requestId: 'request-id', url: 'fake-url' }),
        )
        expect(store.getState()).toEqual({
          byUrl: {
            'fake-url': {
              error: null,
              current: STUB_TOKEN_LIST,
              loadingRequestId: null,
              pendingUpdate: null,
            },
          },
          activeListUrls: undefined,
        })
      })

      it('does not save to current if list is newer patch version', () => {
        store.dispatch(
          fetchTokenList.fulfilled({ tokenList: STUB_TOKEN_LIST, requestId: 'request-id', url: 'fake-url' }),
        )

        store.dispatch(
          fetchTokenList.fulfilled({ tokenList: PATCHED_STUB_LIST, requestId: 'request-id', url: 'fake-url' }),
        )
        expect(store.getState()).toEqual({
          byUrl: {
            'fake-url': {
              error: null,
              current: STUB_TOKEN_LIST,
              loadingRequestId: null,
              pendingUpdate: PATCHED_STUB_LIST,
            },
          },
          activeListUrls: undefined,
        })
      })
      it('does not save to current if list is newer minor version', () => {
        store.dispatch(
          fetchTokenList.fulfilled({ tokenList: STUB_TOKEN_LIST, requestId: 'request-id', url: 'fake-url' }),
        )

        store.dispatch(
          fetchTokenList.fulfilled({ tokenList: MINOR_UPDATED_STUB_LIST, requestId: 'request-id', url: 'fake-url' }),
        )
        expect(store.getState()).toEqual({
          byUrl: {
            'fake-url': {
              error: null,
              current: STUB_TOKEN_LIST,
              loadingRequestId: null,
              pendingUpdate: MINOR_UPDATED_STUB_LIST,
            },
          },
          activeListUrls: undefined,
        })
      })
      it('does not save to pending if list is newer major version', () => {
        store.dispatch(
          fetchTokenList.fulfilled({ tokenList: STUB_TOKEN_LIST, requestId: 'request-id', url: 'fake-url' }),
        )

        store.dispatch(
          fetchTokenList.fulfilled({ tokenList: MAJOR_UPDATED_STUB_LIST, requestId: 'request-id', url: 'fake-url' }),
        )
        expect(store.getState()).toEqual({
          byUrl: {
            'fake-url': {
              error: null,
              current: STUB_TOKEN_LIST,
              loadingRequestId: null,
              pendingUpdate: MAJOR_UPDATED_STUB_LIST,
            },
          },
          activeListUrls: undefined,
        })
      })
    })

    describe('rejected', () => {
      it('no-op if not loading', () => {
        store = resetStore({ byUrl: {}, activeListUrls: undefined })
        store.dispatch(fetchTokenList.rejected({ requestId: 'request-id', errorMessage: 'abcd', url: 'fake-url' }))
        expect(store.getState()).toEqual({
          byUrl: {},
          activeListUrls: undefined,
        })
      })

      it('sets the error if loading', () => {
        store = resetStore({
          byUrl: {
            'fake-url': {
              error: null,
              current: null,
              loadingRequestId: 'request-id',
              pendingUpdate: null,
            },
          },
          activeListUrls: undefined,
        })
        store.dispatch(fetchTokenList.rejected({ requestId: 'request-id', errorMessage: 'abcd', url: 'fake-url' }))
        expect(store.getState()).toEqual({
          byUrl: {
            'fake-url': {
              error: 'abcd',
              current: null,
              loadingRequestId: null,
              pendingUpdate: null,
            },
          },
          activeListUrls: undefined,
        })
      })
    })
  })

  describe('addList', () => {
    it('adds the list key to byUrl', () => {
      store = resetStore({
        byUrl: {
          'fake-url': {
            error: null,
            current: STUB_TOKEN_LIST,
            loadingRequestId: null,
            pendingUpdate: null,
          },
        },
        activeListUrls: undefined,
      })
      store.dispatch(addList('list-id'))
      expect(store.getState()).toEqual({
        byUrl: {
          'fake-url': {
            error: null,
            current: STUB_TOKEN_LIST,
            loadingRequestId: null,
            pendingUpdate: null,
          },
          'list-id': {
            error: null,
            current: null,
            loadingRequestId: null,
            pendingUpdate: null,
          },
        },
        activeListUrls: undefined,
      })
    })
    it('no op for existing list', () => {
      store = resetStore({
        byUrl: {
          'fake-url': {
            error: null,
            current: STUB_TOKEN_LIST,
            loadingRequestId: null,
            pendingUpdate: null,
          },
        },
        activeListUrls: undefined,
      })
      store.dispatch(addList('fake-url'))
      expect(store.getState()).toEqual({
        byUrl: {
          'fake-url': {
            error: null,
            current: STUB_TOKEN_LIST,
            loadingRequestId: null,
            pendingUpdate: null,
          },
        },
        activeListUrls: undefined,
      })
    })
  })

  describe('acceptListUpdate', () => {
    it('swaps pending update into current', () => {
      store = resetStore({
        byUrl: {
          'fake-url': {
            error: null,
            current: STUB_TOKEN_LIST,
            loadingRequestId: null,
            pendingUpdate: PATCHED_STUB_LIST,
          },
        },
        activeListUrls: undefined,
      })
      store.dispatch(acceptListUpdate('fake-url'))
      expect(store.getState()).toEqual({
        byUrl: {
          'fake-url': {
            error: null,
            current: PATCHED_STUB_LIST,
            loadingRequestId: null,
            pendingUpdate: null,
          },
        },
        activeListUrls: undefined,
      })
    })
  })

  describe('removeList', () => {
    it('deletes the list key', () => {
      store = resetStore({
        byUrl: {
          'fake-url': {
            error: null,
            current: STUB_TOKEN_LIST,
            loadingRequestId: null,
            pendingUpdate: PATCHED_STUB_LIST,
          },
        },
        activeListUrls: undefined,
      })
      store.dispatch(removeList('fake-url'))
      expect(store.getState()).toEqual({
        byUrl: {},
        activeListUrls: undefined,
      })
    })
    it('Removes from active lists if active list is removed', () => {
      store = resetStore({
        byUrl: {
          'fake-url': {
            error: null,
            current: STUB_TOKEN_LIST,
            loadingRequestId: null,
            pendingUpdate: PATCHED_STUB_LIST,
          },
        },
        activeListUrls: ['fake-url'],
      })
      store.dispatch(removeList('fake-url'))
      expect(store.getState()).toEqual({
        byUrl: {},
        activeListUrls: [],
      })
    })
  })

  describe('enableList', () => {
    it('enables a list url', () => {
      store = resetStore({
        byUrl: {
          'fake-url': {
            error: null,
            current: STUB_TOKEN_LIST,
            loadingRequestId: null,
            pendingUpdate: PATCHED_STUB_LIST,
          },
        },
        activeListUrls: undefined,
      })
      store.dispatch(enableList('fake-url'))
      expect(store.getState()).toEqual({
        byUrl: {
          'fake-url': {
            error: null,
            current: STUB_TOKEN_LIST,
            loadingRequestId: null,
            pendingUpdate: PATCHED_STUB_LIST,
          },
        },
        activeListUrls: ['fake-url'],
      })
    })
    it('adds to url keys if not present already on enable', () => {
      store = resetStore({
        byUrl: {
          'fake-url': {
            error: null,
            current: STUB_TOKEN_LIST,
            loadingRequestId: null,
            pendingUpdate: PATCHED_STUB_LIST,
          },
        },
        activeListUrls: undefined,
      })
      store.dispatch(enableList('fake-url-invalid'))
      expect(store.getState()).toEqual({
        byUrl: {
          'fake-url': {
            error: null,
            current: STUB_TOKEN_LIST,
            loadingRequestId: null,
            pendingUpdate: PATCHED_STUB_LIST,
          },
          'fake-url-invalid': {
            error: null,
            current: null,
            loadingRequestId: null,
            pendingUpdate: null,
          },
        },
        activeListUrls: ['fake-url-invalid'],
      })
    })
    it('enable works if list already added', () => {
      store = resetStore({
        byUrl: {
          'fake-url': {
            error: null,
            current: null,
            loadingRequestId: null,
            pendingUpdate: null,
          },
        },
        activeListUrls: undefined,
      })
      store.dispatch(enableList('fake-url'))
      expect(store.getState()).toEqual({
        byUrl: {
          'fake-url': {
            error: null,
            current: null,
            loadingRequestId: null,
            pendingUpdate: null,
          },
        },
        activeListUrls: ['fake-url'],
      })
    })
  })

  describe('updateVersion', () => {
    describe('never initialized', () => {
      beforeEach(() => {
        store = resetStore({
          byUrl: {
            'https://unpkg.com/@uniswap/default-token-list@latest/uniswap-default.tokenlist.json': {
              error: null,
              current: STUB_TOKEN_LIST,
              loadingRequestId: null,
              pendingUpdate: null,
            },
            'https://unpkg.com/@uniswap/default-token-list@latest': {
              error: null,
              current: STUB_TOKEN_LIST,
              loadingRequestId: null,
              pendingUpdate: null,
            },
          },
          activeListUrls: undefined,
        })
        store.dispatch(updateListVersion())
      })

      it('clears the current lists', () => {
        expect(
          store.getState().byUrl['https://unpkg.com/@uniswap/default-token-list@latest/uniswap-default.tokenlist.json'],
        ).toBeUndefined()
        expect(store.getState().byUrl['https://unpkg.com/@uniswap/default-token-list@latest']).toBeUndefined()
      })

      it('puts in all the new lists', () => {
        expect(Object.keys(store.getState().byUrl)).toEqual(DEFAULT_LIST_OF_LISTS)
      })
      it('all lists are empty', () => {
        const s = store.getState()
        Object.keys(s.byUrl).forEach((url) => {
          expect(s.byUrl[url]).toEqual({
            error: null,
            current: null,
            loadingRequestId: null,
            pendingUpdate: null,
          })
        })
      })
      it('sets initialized lists', () => {
        expect(store.getState().lastInitializedDefaultListOfLists).toEqual(DEFAULT_LIST_OF_LISTS)
      })
      it('sets selected list', () => {
        expect(store.getState().activeListUrls).toEqual(DEFAULT_ACTIVE_LIST_URLS)
      })
    })
    describe('initialized with a different set of lists', () => {
      beforeEach(() => {
        store = resetStore({
          byUrl: {
            'https://unpkg.com/@uniswap/default-token-list@latest/uniswap-default.tokenlist.json': {
              error: null,
              current: STUB_TOKEN_LIST,
              loadingRequestId: null,
              pendingUpdate: null,
            },
            'https://unpkg.com/@uniswap/default-token-list@latest': {
              error: null,
              current: STUB_TOKEN_LIST,
              loadingRequestId: null,
              pendingUpdate: null,
            },
          },
          activeListUrls: undefined,
          lastInitializedDefaultListOfLists: ['https://unpkg.com/@uniswap/default-token-list@latest'],
        })
        store.dispatch(updateListVersion())
      })

      it('does not remove lists not in last initialized list of lists', () => {
        expect(
          store.getState().byUrl['https://unpkg.com/@uniswap/default-token-list@latest/uniswap-default.tokenlist.json'],
        ).toEqual({
          error: null,
          current: STUB_TOKEN_LIST,
          loadingRequestId: null,
          pendingUpdate: null,
        })
      })
      it('removes lists in the last initialized list of lists', () => {
        expect(store.getState().byUrl['https://unpkg.com/@uniswap/default-token-list@latest']).toBeUndefined()
      })

      it('each of those initialized lists is empty', () => {
        const { byUrl } = store.getState()
        // note we don't expect the uniswap default list to be prepopulated
        // this is ok.
        Object.keys(byUrl).forEach((url) => {
          if (url !== 'https://unpkg.com/@uniswap/default-token-list@latest/uniswap-default.tokenlist.json') {
            expect(byUrl[url]).toEqual({
              error: null,
              current: null,
              loadingRequestId: null,
              pendingUpdate: null,
            })
          }
        })
      })

      it('sets initialized lists', () => {
        expect(store.getState().lastInitializedDefaultListOfLists).toEqual(DEFAULT_LIST_OF_LISTS)
      })
      it('sets default list to selected list', () => {
        expect(store.getState().activeListUrls).toEqual(DEFAULT_ACTIVE_LIST_URLS)
      })
    })
  })
})
