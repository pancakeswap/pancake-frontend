const LS_KEY = 'pancakeswap_language'
export const BLOG_LS_KEY = 'blog_pancakeswap_language'

export const getLanguageCodeFromLS = () => {
  try {
    const codeFromStorage = localStorage.getItem(LS_KEY)
    const blogCodeFromStorage = localStorage.getItem(BLOG_LS_KEY)

    return blogCodeFromStorage || codeFromStorage || 'en'
  } catch {
    return 'en'
  }
}
