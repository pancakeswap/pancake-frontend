import { Unsubscribe } from '@reduxjs/toolkit'
import { atom } from 'jotai'
import { RESET } from 'jotai/utils'
import { AsyncStorage, SyncStorage } from 'jotai/utils/atomWithStorage'

// eslint-disable-next-line symbol-description
export const NO_STORAGE_VALUE = Symbol()
type SetStateActionWithReset<Value> = Value | typeof RESET | ((prev: Value) => Value | typeof RESET)

export function atomWithStorage<Value>(
  key: string,
  initialValue: Value,
  storage: SyncStorage<Value> | AsyncStorage<Value>,
) {
  const getInitialValue = () => {
    const value = storage.getItem(key)
    if (value instanceof Promise) {
      // @ts-ignore
      return value.then((v) => (v === NO_STORAGE_VALUE ? initialValue : v))
    }
    // @ts-ignore
    return value === NO_STORAGE_VALUE ? initialValue : value
  }

  const baseAtom = atom(storage.delayInit ? initialValue : getInitialValue())

  baseAtom.onMount = (setAtom) => {
    let unsub: Unsubscribe | undefined
    if (storage.subscribe) {
      unsub = storage.subscribe(key, setAtom)
      // in case it's updated before subscribing
      setAtom(getInitialValue())
    }
    if (storage.delayInit) {
      const value = getInitialValue()
      if (value instanceof Promise) {
        value.then((v) => {
          setAtom(v)
        })
      } else {
        setAtom(value)
      }
    }
    return unsub
  }

  const anAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: SetStateActionWithReset<Value>) => {
      const nextValue =
        typeof update === 'function' ? (update as (prev: Value) => Value | typeof RESET)(get(baseAtom)) : update

      if (nextValue === RESET) {
        set(baseAtom, initialValue)
        return storage.removeItem(key)
      }

      set(baseAtom, nextValue)
      return storage.setItem(key, nextValue)
    },
  )

  return anAtom
}
