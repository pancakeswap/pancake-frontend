import { EN, LanguageCode } from '../../config/localization/languages'

const publicUrl = process.env.PUBLIC_URL

export const LS_KEY = 'pancakeswap_language'

export const fetchLocale = async (code: LanguageCode) => {
  const response = await fetch(`${publicUrl}/locales/${code}.json`)
  const data = await response.json()
  return data
}

export const getLanguageCodeFromLS = (): LanguageCode => {
  try {
    const codeFromStorage = localStorage.getItem(LS_KEY) as LanguageCode

    return codeFromStorage || EN.code
  } catch {
    return EN.code
  }
}
