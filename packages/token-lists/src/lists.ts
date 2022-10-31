import { atomWithStorage, useReducerAtom } from 'jotai/utils'
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

export const createListsAtom = (storeName: string, reducer, initialState) => {
  let gotOnce = false
  /**
   * Persist you redux state using IndexedDB
   * @param {string} dbName - IndexedDB database name
   */
  function IndexedDBStorage(dbName) {
    if (typeof window !== 'undefined') {
      const db = localForage.createInstance({
        name: dbName,
        storeName,
      })
      return {
        db,
        getItem: async (key) => {
          const value = await db.getItem(key)
          gotOnce = true
          if (value) {
            return value
          }
          return initialState
        },
        setItem: (k, v) => {
          if (gotOnce) {
            return db.setItem(k, v)
          }
          return undefined
        },
        removeItem: db.removeItem,
        delayInit: true,
      }
    }
    return noopStorage
  }

  const listsAtom = atomWithStorage<ListsState>(
    'lists',
    initialState,
    // @ts-ignore
    IndexedDBStorage('lists'),
  )

  function useListState() {
    return useReducerAtom(listsAtom, reducer)
  }

  return {
    listsAtom,
    useListState,
  }
}
