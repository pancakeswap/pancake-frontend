import { useEffect, useState } from 'react'

export const useSessionStorage = <T>(keyName: string, defaultValue: T) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.sessionStorage.getItem(keyName)

      if (value) {
        return JSON.parse(value)
      }
      window.sessionStorage.setItem(keyName, JSON.stringify(defaultValue))
      return defaultValue
    } catch (err) {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      window.sessionStorage.setItem(keyName, JSON.stringify(storedValue))
    } catch (error) {
      //
    }
  }, [keyName, storedValue])

  return [storedValue, setStoredValue]
}
