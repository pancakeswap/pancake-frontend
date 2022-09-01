import { atom, Atom, useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { useEffect } from 'react'
import IndexedDBStorage from 'utils/IndexedDBStorage'
import { fetchTokenList } from './actions'
import listReducer, { initialState } from './reducer'

const storage = createJSONStorage(() => IndexedDBStorage('lists'))
storage.delayInit = true
const listsAtom = atomWithStorage('lists-2', initialState, storage)

export function useListState() {
  return useAtom(listStateAtom)
}

function atomWithReducerAtom<Atom, Action>(initatom: Atom, reducer: (value: Value, action: Action) => Value) {
  const anAtom: any = atom(
    (get) => get(initatom),
    (get, set, action: Action) => set(initatom, reducer(get(initatom), action)),
  )
  return anAtom
}

export const listStateAtom = atomWithReducerAtom(listsAtom, listReducer)
