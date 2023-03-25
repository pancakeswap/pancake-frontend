import { atom, useAtom, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import localForage from 'localforage'
import { ListsState } from './reducer'

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}
const noopStorage = {
  getItem: noop,
  setItem: noop,
  removeItem: noop,
  keys: [],
  getAllKeys: noop,
}

// eslint-disable-next-line symbol-description
const EMPTY = Symbol()

export const createListsAtom = (storeName: string, reducer: any, initialState: any) => {
  /**
   * Persist you redux state using IndexedDB
   * @param {string} dbName - IndexedDB database name
   */
  function IndexedDBStorage(dbName: string) {
    if (typeof window !== 'undefined') {
      const db = localForage.createInstance({
        name: dbName,
        storeName,
      })
      return {
        db,
        getItem: async (key: string) => {
          const value = await db.getItem(key)
          if (value) {
            return value
          }
          return initialState
        },
        setItem: (k: string, v: any) => {
          if (v === EMPTY) return
          // eslint-disable-next-line consistent-return
          return db.setItem(k, v)
        },
        removeItem: db.removeItem,
      }
    }
    return noopStorage
  }

  const listsStorageAtom = atomWithStorage<ListsState | typeof EMPTY>(
    'lists',
    EMPTY,
    // @ts-ignore
    IndexedDBStorage('lists'),
  )

  const defaultStateAtom = atom<ListsState, any, void>(
    (get) => {
      const got = get(listsStorageAtom)
      if (got === EMPTY) {
        return initialState
      }
      return got
    },
    (get, set, action) => {
      set(listsStorageAtom, reducer(get(defaultStateAtom), action))
    },
  )

  const isReadyAtom = atom((get) => get(listsStorageAtom) !== EMPTY)

  function useListState() {
    return useAtom(defaultStateAtom)
  }

  function useListStateReady() {
    return useAtomValue(isReadyAtom)
  }

  return {
    listsAtom: defaultStateAtom,
    useListStateReady,
    useListState,
  }
}
