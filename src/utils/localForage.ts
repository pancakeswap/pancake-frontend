import localForage from 'localforage'

/**
 * Persist you redux state using IndexedDB
 * @param {string} dbName - IndexedDB database name
 */
function storage(dbName) {
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

export default storage
