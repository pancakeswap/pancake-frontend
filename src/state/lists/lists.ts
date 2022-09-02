import { atomWithStorage } from 'hooks/atomWithStorage'
import { createStore, del, get, set } from 'idb-keyval'
import { useReducerAtom } from 'jotai/utils'
import listReducer, { initialState, ListsState } from './reducer'

let gotOnce = false

export const listStore = typeof window !== 'undefined' && createStore('lists', 'list-v1')
function createStorage<T>() {
  return {
    // eslint-disable-next-line consistent-return
    setItem: (key, value) => {
      if (listStore && gotOnce) {
        return set(key, value, listStore)
      }
    },
    getItem: (key) =>
      get<T>(key, listStore).then((value) => {
        if (value !== undefined) {
          gotOnce = true
          return value
        }
        return undefined
      }),
    removeItem: (key) => {
      return del(key, listStore)
    },
    delayInit: true,
  }
}

const storage = createStorage<ListsState>()

export const listsAtom = atomWithStorage<ListsState>('lists', initialState, storage)

export function useListState() {
  return useReducerAtom(listsAtom, listReducer)
}
