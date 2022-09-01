import localForage from 'localforage'
import storage from 'redux-persist/lib/storage'

/**
 * Persist you redux state using IndexedDB
 * @param {string} dbName - IndexedDB database name
 */
function IndexedDBStorage(dbName) {
  if (typeof window !== 'undefined') {
    const db = localForage.createInstance({
      name: dbName,
    })
    return {
      db,
      getItem: db.getItem,
      setItem: db.setItem,
      removeItem: db.removeItem,
    }
  }
  return {
    getItem: () => {},
    setItem: () => {},
    removeItem: () => {},
  }
}
export default IndexedDBStorage
