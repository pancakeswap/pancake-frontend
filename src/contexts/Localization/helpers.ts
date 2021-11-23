import { EN } from 'config/localization/languages'

export const LS_KEY = 'pancakeswap_language'

export const fetchLocale = async (locale) => {
  const response = await fetch(`/locales/${locale}.json`)
  const data = await response.json()
  return data
}

export const getLanguageCodeFromLS = () => {
  try {
    const codeFromStorage = localStorage.getItem(LS_KEY)

    return codeFromStorage || EN.locale
  } catch {
    return EN.locale
  }
}
