import { atomWithStorage } from 'jotai/utils'
import { createJSONStorage } from 'jotai/vanilla/utils'

export default function atomWithStorageWithErrorCatch<Value>(
  key: string,
  initialValue: Value,
  getStringStorage?: () => Storage,
) {
  const tryCatchStorage = createJSONStorage<Value>(() => {
    const getStorage =
      getStringStorage ||
      (() => (typeof window !== 'undefined' ? window.localStorage : (undefined as unknown as Storage)))
    const stringStorage = getStorage?.()
    return stringStorage
      ? {
          removeItem: (storageKey: string) => {
            stringStorage.removeItem(storageKey)
          },
          getItem: (storageKey: string) => {
            return stringStorage.getItem(storageKey)
          },
          setItem: (storageKey: string, newValue: string) => {
            try {
              stringStorage.setItem(storageKey, newValue)
            } catch (error) {
              // Add try-catch to avoid breaking the app when localStorage is full.
              console.error(`localStorage error with key ${storageKey}`)
              console.error(error)
            }
          },
        }
      : stringStorage
  })
  return atomWithStorage(key, initialValue, tryCatchStorage)
}
