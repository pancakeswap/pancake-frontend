import { LS_PREFIX } from 'config'
import makeLocalStorageKey from './makeLocalStorageKey'

/**
 * A temporary function to migrate all existing local storage keys and convert them to the new pattern of [prefix]-[version]-[key]
 */
const migrateLocalStorage = () => {
  try {
    const hasMigratedKey = makeLocalStorageKey('migrated')
    const hasMigratedLocal = localStorage.getItem(hasMigratedKey)
    const hasMigrated: boolean = JSON.parse(hasMigratedLocal)

    if (hasMigrated !== true) {
      if (localStorage.length > 0) {
        // Run through each key in local storage and re-save it with the proper namespace
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)

          // Only migrate keys that have not already been migrated
          if (!key.startsWith(LS_PREFIX)) {
            const defaultNamespace = 'redux_localstorage_simple_'
            const newKey = makeLocalStorageKey(
              localStorage.key(i).startsWith(defaultNamespace)
                ? localStorage.key(i).substr(defaultNamespace.length)
                : localStorage.key(i),
            )
            const value = localStorage.getItem(key)
            localStorage.setItem(newKey, value)
          }
        }
      }
      localStorage.setItem(hasMigratedKey, JSON.stringify(true))
    }
  } catch {
    console.error('Error migrating local storage')
  }
}

export default migrateLocalStorage
