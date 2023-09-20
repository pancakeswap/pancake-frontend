import { atom, useAtom, useAtomValue } from 'jotai'
import { atomWithStorage, loadable } from 'jotai/utils'
import { type AsyncStorage } from 'jotai/vanilla/utils/atomWithStorage'
import localForage from 'localforage'
import { ListsState } from './reducer'

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

const noopStorage: AsyncStorage<any> = {
  getItem: () => Promise.resolve(noop()),
  setItem: () => Promise.resolve(noop()),
  removeItem: () => Promise.resolve(noop()),
}

// eslint-disable-next-line symbol-description
const EMPTY = Symbol()

export const createListsAtom = (storeName: string, reducer: any, initialState: any) => {
  /**
   * Persist you redux state using IndexedDB
   * @param {string} dbName - IndexedDB database name
   */
  function IndexedDBStorage<Value>(dbName: string): AsyncStorage<Value> {
    if (typeof window !== 'undefined') {
      const db = localForage.createInstance({
        name: dbName,
        storeName,
      })
      return {
        getItem: async (key: string) => {
          const value = await db.getItem(key)
          if (value) {
            return value
          }
          return initialState
        },
        setItem: async (k: string, v: any) => {
          if (v === EMPTY) return
          await db.setItem(k, v)
        },
        removeItem: db.removeItem,
      }
    }
    return noopStorage
  }

  const listsStorageAtom = atomWithStorage<ListsState | typeof EMPTY>('lists', EMPTY, IndexedDBStorage('lists'))

  const defaultStateAtom = atom<ListsState, any, void>(
    (get) => {
      const value = get(loadable(listsStorageAtom))
      if (value.state === 'hasData' && value.data !== EMPTY) {
        return value.data
      }
      return initialState
    },
    async (get, set, action) => {
      set(listsStorageAtom, reducer(await get(defaultStateAtom), action))
    },
  )

  const isReadyAtom = loadable(listsStorageAtom)

  function useListState() {
    return useAtom(defaultStateAtom)
  }

  function useListStateReady() {
    const value = useAtomValue(isReadyAtom)
    return value.state === 'hasData' && value.data !== EMPTY
  }

  return {
    listsAtom: defaultStateAtom,
    useListStateReady,
    useListState,
  }
}
