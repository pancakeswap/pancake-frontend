import React, { useState, useEffect } from 'react'
import { StringTranslations } from '@crowdin/crowdin-api-client'
import { TranslationsContext } from 'contexts/Localisation/translationsContext'
import { allLanguages, EN } from 'config/localisation/languageCodes'

const CACHE_KEY = 'pancakeSwapLanguage'

export interface LangType {
  code: string
  language: string
}

export interface LanguageState {
  selectedLanguage: LangType
  setSelectedLanguage: (langObject: LangType) => void
  translatedLanguage: LangType
  setTranslatedLanguage: React.Dispatch<React.SetStateAction<LangType>>
}

const LanguageContext = React.createContext({
  selectedLanguage: EN,
  setSelectedLanguage: () => undefined,
  translatedLanguage: EN,
  setTranslatedLanguage: () => undefined,
} as LanguageState)

const fileId = 8
const projectId = parseInt(process.env.REACT_APP_CROWDIN_PROJECTID)
const stringTranslationsApi = new StringTranslations({
  token: process.env.REACT_APP_CROWDIN_APIKEY,
})

const fetchTranslationsForSelectedLanguage = (selectedLanguage) => {
  return stringTranslationsApi.listLanguageTranslations(projectId, selectedLanguage.code, undefined, fileId, 400)
}

const LanguageContextProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<any>(null)
  const [translatedLanguage, setTranslatedLanguage] = useState<any>(EN)
  const [translations, setTranslations] = useState<Array<any>>([])

  const getStoredLang = (storedLangCode: string) => {
    return allLanguages.filter((language) => {
      return language.code === storedLangCode
    })[0]
  }

  useEffect(() => {
    const storedLangCode = localStorage.getItem(CACHE_KEY)
    if (storedLangCode) {
      const storedLang = getStoredLang(storedLangCode)
      setSelectedLanguage(storedLang)
    } else {
      setSelectedLanguage(EN)
    }
  }, [])

  useEffect(() => {
    if (selectedLanguage) {
      fetchTranslationsForSelectedLanguage(selectedLanguage)
        .then((translationApiResponse) => {
          if (translationApiResponse.data.length < 1) {
            setTranslations([])
          } else {
            setTranslations(translationApiResponse.data)
          }
        })
        .then(() => setTranslatedLanguage(selectedLanguage))
        .catch((e) => {
          setTranslations([])
          console.error('Error while loading translations', e)
        })
    }
  }, [selectedLanguage])

  const handleLanguageSelect = (langObject: LangType) => {
    setSelectedLanguage(langObject)
    localStorage.setItem(CACHE_KEY, langObject.code)
  }

  return (
    <LanguageContext.Provider
      value={{ selectedLanguage, setSelectedLanguage: handleLanguageSelect, translatedLanguage, setTranslatedLanguage }}
    >
      <TranslationsContext.Provider value={{ translations, setTranslations }}>{children}</TranslationsContext.Provider>
    </LanguageContext.Provider>
  )
}

export { LanguageContext, LanguageContextProvider }
