import identity from 'lodash/identity'
import { useEffect, useState } from 'react'

interface UsePersistStateOptions {
  localStorageKey: string
  hydrate?: (value: any) => any
  dehydrate?: (value: any) => any
}

const defaultOptions = {
  hydrate: identity,
  dehydrate: identity,
}

/**
 * Same as "useState" but saves the value to local storage each time it changes
 */
const usePersistState = (initialValue: any, userOptions: UsePersistStateOptions) => {
  const { localStorageKey, hydrate, dehydrate } = { ...defaultOptions, ...userOptions }
  const [value, setValue] = useState(() => {
    try {
      const valueFromLS = localStorage.getItem(localStorageKey)

      return valueFromLS ? hydrate(JSON.parse(valueFromLS)) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage?.setItem(localStorageKey, JSON.stringify(dehydrate(value)))
  }, [value, localStorageKey, dehydrate])

  return [value, setValue]
}

export default usePersistState
