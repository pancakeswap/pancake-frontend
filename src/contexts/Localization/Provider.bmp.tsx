import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Language } from '@pancakeswap/uikit'
import { EN, RU, ZHCN, ZHTW, VI, languages, ESES } from 'config/localization/languages'
import translations from 'config/localization/translations.json'
import en from 'config/localization/mp-translations/en.json'
import ru from 'config/localization/mp-translations/ru.json'
import vi from 'config/localization/mp-translations/vi.json'
import es from 'config/localization/mp-translations/es.json'
import zhcn from 'config/localization/mp-translations/zh-cn.json'
import zhtw from 'config/localization/mp-translations/zh-tw.json'
import { ContextApi, ContextData, ProviderState } from './types'
import { LS_KEY, fetchLocale, getLanguageCodeFromLS } from './helpers'

const initialState: ProviderState = {
  isFetching: true,
  currentLanguage: EN,
}

const mpSpecificTranslation = () => {
  const locale = getLanguageCodeFromLS()
  switch (locale) {
    case RU.locale:
      return { ...en, ...ru }
    case ZHCN.locale:
      return { ...en, ...zhcn }
    case ZHTW.locale:
      return { ...en, ...zhtw }
    case VI.locale:
      return { ...en, ...vi }
    case ESES.locale:
      return { ...en, ...es }
    default:
      return { ...en }
  }
}

// Export the translations directly
export const languageMap = new Map<Language['locale'], Record<string, string>>()
languageMap.set(EN.locale, { ...translations, ...mpSpecificTranslation() })

export const LanguageContext = createContext<ContextApi>(undefined)

export const LanguageProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<ProviderState>(() => {
    const codeFromStorage = getLanguageCodeFromLS()

    return {
      ...initialState,
      currentLanguage: languages[codeFromStorage],
    }
  })
  const { currentLanguage } = state

  useEffect(() => {
    const fetchInitialLocales = async () => {
      const codeFromStorage = getLanguageCodeFromLS()

      if (codeFromStorage !== EN.locale) {
        const enLocale = languageMap.get(EN.locale)
        const currentLocale = await fetchLocale(codeFromStorage)
        languageMap.set(codeFromStorage, { ...enLocale, ...currentLocale, ...mpSpecificTranslation() })
      }
      setState((prevState) => ({
        ...prevState,
        isFetching: false,
      }))
    }

    fetchInitialLocales()
  }, [setState])

  const setLanguage = useCallback(async (language: Language) => {
    if (!languageMap.has(language.locale)) {
      setState((prevState) => ({
        ...prevState,
        isFetching: true,
      }))

      const locale = await fetchLocale(language.locale)
      const enLocale = languageMap.get(EN.locale)

      // Merge the EN locale to ensure that any locale fetched has all the keys
      languageMap.set(language.locale, { ...enLocale, ...locale })
      localStorage.setItem(LS_KEY, language.locale)

      setState((prevState) => ({
        ...prevState,
        isFetching: false,
        currentLanguage: language,
      }))
    } else {
      localStorage.setItem(LS_KEY, language.locale)
      setState((prevState) => ({
        ...prevState,
        isFetching: false,
        currentLanguage: language,
      }))
    }
  }, [])

  const translate = useCallback(
    (key: string, data?: ContextData) => {
      const translationSet = languageMap.has(currentLanguage.locale)
        ? languageMap.get(currentLanguage.locale)
        : languageMap.get(EN.locale)
      const translatedText = translationSet[key] || key

      // Check the existence of at least one combination of %%, separated by 1 or more non space characters
      const includesVariable = translatedText.match(/%\S+?%/gm)

      if (includesVariable && data) {
        let interpolatedText = translatedText
        Object.keys(data).forEach((dataKey) => {
          const templateKey = new RegExp(`%${dataKey}%`, 'g')
          interpolatedText = interpolatedText.replace(templateKey, data[dataKey].toString())
        })

        return interpolatedText
      }

      return translatedText
    },
    [currentLanguage],
  )

  return <LanguageContext.Provider value={{ ...state, setLanguage, t: translate }}>{children}</LanguageContext.Provider>
}
