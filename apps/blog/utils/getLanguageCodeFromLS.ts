const LS_KEY = 'pancakeswap_language'

export const getLanguageCodeFromLS = () => {
  try {
    const codeFromStorage = localStorage.getItem(LS_KEY)

    return codeFromStorage || 'en'
  } catch {
    return 'en'
  }
}
