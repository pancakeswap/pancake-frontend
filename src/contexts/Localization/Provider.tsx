import { createContext, useCallback, useEffect, useState } from 'react'
import { Language } from '@pancakeswap/uikit'
import fromPairs from 'lodash/fromPairs'
import { EN, languages } from 'config/localization/languages'
import translations from 'config/localization/translations.json'
import { ContextApi, ProviderState, TranslateFunction } from './types'
import { LS_KEY, fetchLocale, getLanguageCodeFromLS } from './helpers'

const initialState: ProviderState = {
  isFetching: true,
  currentLanguage: EN,
}

const includesVariableRegex = new RegExp(/%\S+?%/, 'gm')

const translatedTextIncludesVariable = (translatedText: string): boolean => {
  return !!translatedText?.match(includesVariableRegex)
}

const getTranslationsWithIncludesVariable = (
  translationList: Record<string, string>,
): Record<string, { translatedText: string; includesVariable: boolean }> => {
  if (!translationList) {
    return null
  }

  return fromPairs(
    Object.entries(translationList).map(([key, value]) => [
      key,
      {
        translatedText: value,
        // Check the existence of at least one combination of %%, separated by 1 or more non space characters
        includesVariable: translatedTextIncludesVariable(value),
      },
    ]),
  )
}

// Export the translations directly
export const languageMap = new Map<
  Language['locale'],
  Record<string, { translatedText: string; includesVariable: boolean }>
>()
languageMap.set(EN.locale, getTranslationsWithIncludesVariable(translations))

export const LanguageContext = createContext<ContextApi>(undefined)

export const LanguageProvider: React.FC = ({ children }) => {
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
          const currentLocaleWithIncludesVariables = getTranslationsWithIncludesVariable(currentLocale)
          languageMap.set(codeFromStorage, { ...enLocale, ...currentLocaleWithIncludesVariables })
        }
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
      if (locale) {
        const localeWithIncludesVariables = getTranslationsWithIncludesVariable(locale)
        const enLocale = languageMap.get(EN.locale)
        // Merge the EN locale to ensure that any locale fetched has all the keys
        languageMap.set(language.locale, { ...enLocale, ...localeWithIncludesVariables })
      }

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

  const translate: TranslateFunction = useCallback(
    (key, data) => {
      const translationSet = languageMap.get(currentLanguage.locale) ?? languageMap.get(EN.locale)
      const { translatedText, includesVariable } = translationSet[key] || {
        translatedText: key,
        includesVariable: translatedTextIncludesVariable(key),
      }

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
