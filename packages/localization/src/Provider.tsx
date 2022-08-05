import { createContext, useCallback, useEffect, useState } from 'react'
import { Language } from '@pancakeswap/uikit'
import { useLastUpdated } from '@pancakeswap/hooks'
import memoize from 'lodash/memoize'
import { EN, languages } from './config/languages'
import translations from './config/translations.json'
import { ContextApi, ProviderState, TranslateFunction } from './types'
import { LS_KEY, fetchLocale, getLanguageCodeFromLS } from './helpers'

const initialState: ProviderState = {
  isFetching: true,
  currentLanguage: EN,
}

const includesVariableRegex = new RegExp(/%\S+?%/, 'gm')

const translatedTextIncludesVariable = memoize((translatedText: string): boolean => {
  return !!translatedText?.match(includesVariableRegex)
})

// Export the translations directly
export const languageMap = new Map<Language['locale'], Record<string, string>>()
languageMap.set(EN.locale, translations)

export const LanguageContext = createContext<ContextApi>(undefined)

export const LanguageProvider: React.FC = ({ children }) => {
  const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()
  const [state, setState] = useState<ProviderState>(() => {
    const codeFromStorage = getLanguageCodeFromLS()

    return {
      ...initialState,
      currentLanguage: languages[codeFromStorage] || EN,
    }
  })
  const { currentLanguage } = state

  useEffect(() => {
    const fetchInitialLocales = async () => {
      const codeFromStorage = getLanguageCodeFromLS()

      if (codeFromStorage !== EN.locale) {
        const enLocale = languageMap.get(EN.locale)
        const currentLocale = await fetchLocale(codeFromStorage)
        if (currentLocale) {
          languageMap.set(codeFromStorage, { ...enLocale, ...currentLocale })
          refresh()
        }
      }

      setState((prevState) => ({
        ...prevState,
        isFetching: false,
      }))
    }

    fetchInitialLocales()
  }, [refresh])

  const setLanguage = useCallback(async (language: Language) => {
    if (!languageMap.has(language.locale)) {
      setState((prevState) => ({
        ...prevState,
        isFetching: true,
      }))

      const locale = await fetchLocale(language.locale)
      if (locale) {
        const enLocale = languageMap.get(EN.locale)
        // Merge the EN locale to ensure that any locale fetched has all the keys
        languageMap.set(language.locale, { ...enLocale, ...locale })
      }

      localStorage?.setItem(LS_KEY, language.locale)

      setState((prevState) => ({
        ...prevState,
        isFetching: false,
        currentLanguage: language,
      }))
    } else {
      localStorage?.setItem(LS_KEY, language.locale)
      setState((prevState) => ({
        ...prevState,
        isFetching: false,
        currentLanguage: language,
      }))
    }
  }, [])

  const translate: TranslateFunction = useCallback(
    (key, data) => {
      const translationSet = languageMap.get(currentLanguage.locale) ?? languageMap.get(EN.locale)
      const translatedText = translationSet[key] || key

      // Check the existence of at least one combination of %%, separated by 1 or more non space characters
      const includesVariable = translatedTextIncludesVariable(key)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLanguage, lastUpdated],
  )

  return <LanguageContext.Provider value={{ ...state, setLanguage, t: translate }}>{children}</LanguageContext.Provider>
}
