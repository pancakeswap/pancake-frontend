const getLocalStorageItemKeys = (prefix: string) => {
  const result = []
  for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).startsWith(prefix)) {
      result.push(localStorage.key(i))
    }
  }
  return result
}

export default getLocalStorageItemKeys
