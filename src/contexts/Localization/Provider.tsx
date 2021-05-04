import React, { createContext, useCallback, useEffect, useState } from 'react'
import { EN, languages, Language } from '../../config/localization/languages'
import translations from '../../config/localization/translations.json'
import { ContextApi, ContextData, ProviderState } from './types'
import { LS_KEY, fetchLocale, getLanguageCodeFromLS } from './helpers'

const initialState: ProviderState = {
  isFetching: true,
  currentLanguage: EN,
}

// Export the translations directly
export const languageMap = new Map<Language['code'], Record<string, string>>()
languageMap.set(EN.code, translations)

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

      if (codeFromStorage !== EN.code) {
        const enLocale = languageMap.get(EN.code)
        const currentLocale = await fetchLocale(codeFromStorage)
        languageMap.set(codeFromStorage, { ...enLocale, ...currentLocale })
      }

      setState((prevState) => ({
        ...prevState,
        isFetching: false,
      }))
    }

    fetchInitialLocales()
  }, [setState])

  const setLanguage = async (language: Language) => {
    if (!languageMap.has(language.code)) {
      setState((prevState) => ({
        ...prevState,
        isFetching: true,
      }))

      const locale = await fetchLocale(language.code)
      const enLocale = languageMap.get(EN.code)

      // Merge the EN locale to ensure that any locale fetched has all the keys
      languageMap.set(language.code, { ...enLocale, ...locale })
      localStorage.setItem(LS_KEY, language.code)

      setState((prevState) => ({
        ...prevState,
        isFetching: false,
        currentLanguage: language,
      }))
    } else {
      localStorage.setItem(LS_KEY, language.code)
      setState((prevState) => ({
        ...prevState,
        isFetching: false,
        currentLanguage: language,
      }))
    }
  }

  const translate = useCallback(
    (key: string, data?: ContextData) => {
      const translationSet = languageMap.has(currentLanguage.code)
        ? languageMap.get(currentLanguage.code)
        : languageMap.get(EN.code)
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
