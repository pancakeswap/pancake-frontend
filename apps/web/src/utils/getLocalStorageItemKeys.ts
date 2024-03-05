const getLocalStorageItemKeys = (prefix: string) => {
  const result: string[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)

    if (key?.startsWith(prefix)) {
      result.push(key)
    }
  }
  return result
}

export default getLocalStorageItemKeys
