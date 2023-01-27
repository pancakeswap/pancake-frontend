import { atom, PrimitiveAtom, SetStateAction } from 'jotai'
import { logError } from './sentry'

type Storage<Value> = {
  getItem: (key: string) => Value | Promise<Value>
  setItem: (key: string, newValue: Value) => void | Promise<void>
}

const defaultStorage: Storage<unknown> = {
  getItem: (key) => {
    const storedValue = localStorage.getItem(key)
    if (storedValue === null) {
      throw new Error('no value stored')
    }
    return JSON.parse(storedValue)
  },
  setItem: (key, newValue) => {
    try {
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch (error) {
      console.error(`localStorage error with key ${key} and value ${newValue}`)

      logError(error)
    }
  },
}

export default function atomWithStorageWithErrorCatch<Value>(
  key: string,
  initialValue: Value,
  storage: Storage<Value> = defaultStorage as Storage<Value>,
): PrimitiveAtom<Value> {
  const getInitialValue = () => {
    try {
      return storage.getItem(key)
    } catch {
      return initialValue
    }
  }

  const baseAtom = atom(initialValue)

  baseAtom.onMount = (setAtom) => {
    Promise.resolve(getInitialValue()).then(setAtom)
  }

  const anAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: SetStateAction<Value>) => {
      const newValue = typeof update === 'function' ? (update as (prev: Value) => Value)(get(baseAtom)) : update
      set(baseAtom, newValue)

      try {
        storage.setItem(key, newValue)
      } catch (error) {
        console.error(`localStorage error with key ${key} and value ${newValue}`)

        logError(error)
      }
    },
  )

  return anAtom
}
