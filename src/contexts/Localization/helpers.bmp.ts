import { EN, languages, languageList } from 'config/localization/languages'
import mpService from '@binance/mp-service'
import { captureException } from '@binance/sentry-miniapp'

const publicUrl = process.env.PUBLIC_URL || 'pancakeswap.finance'

const code2Locale = languageList.reduce((prev, next) => {
  prev[next.code] = next.locale
  return prev
}, {})

export const LS_KEY = 'pancakeswap_language'

export const fetchLocale = async (locale) => {
  const response = await fetch(`https://${publicUrl}/locales/${locale}.json`)
  const data = await response.json()
  return data
}

export const getLanguageCodeFromLS = () => {
  try {
    const { language } = mpService.getSystemInfoSync()
    return languages[language] ? language : code2Locale[language] ? code2Locale[language] : EN.locale
  } catch (e) {
    console.error(e)
    captureException(e)
    return EN.locale
  }
}
