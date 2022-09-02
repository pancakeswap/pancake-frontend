import { atomWithStorage } from 'hooks/atomWithStorage'
import { useReducerAtom } from 'jotai/utils'
import defaultStorge from 'redux-persist/lib/storage'
import localForage from 'localforage'
import listReducer, { initialState, ListsState } from './reducer'

let gotOnce = false

/**
 * Persist you redux state using IndexedDB
 * @param {string} dbName - IndexedDB database name
 */
function IndexedDBStorage(dbName, storeName) {
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
      // eslint-disable-next-line consistent-return
      setItem: (k, v) => {
        if (gotOnce) {
          return db.setItem(k, v)
        }
      },
      removeItem: db.removeItem,
      delayInit: true,
    }
  }
  return defaultStorge
}

export const listsAtom = atomWithStorage<ListsState>(
  'lists',
  initialState,
  // @ts-ignore
  IndexedDBStorage('lists', 'listv1'),
)

export function useListState() {
  return useReducerAtom(listsAtom, listReducer)
}
