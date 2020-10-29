/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { light, dark } from '@pancakeswap-libs/uikit'
import { StringTranslations } from '@crowdin/crowdin-api-client'
import { UseWalletProvider } from 'use-wallet'
import { EN } from './constants/localisation/languageCodes'
import { allLanguages } from './constants/localisation/languageCodes'
import FarmsProvider from './contexts/Farms'
import ModalsProvider from './contexts/Modals'
import TransactionProvider from './contexts/Transactions'
import SushiProvider from './contexts/SushiProvider'
import BscProvider from './contexts/BscProvider'
import { LanguageContext } from './contexts/Localisation/languageContext'
import { TranslationsContext } from './contexts/Localisation/translationsContext'

const fileId = 8
const apiKey = process.env.REACT_APP_CROWDIN_APIKEY
const projectId = parseInt(process.env.REACT_APP_CROWDIN_PROJECTID)
const stringTranslationsApi = new StringTranslations({
  token: apiKey,
})

const fetchTranslationsForSelectedLanguage = (selectedLanguage) => {
  return stringTranslationsApi.listLanguageTranslations(
    projectId,
    selectedLanguage.code,
    undefined,
    fileId,
    200,
  )
}

const Providers: React.FC<{
  isDark: boolean
}> = ({ isDark, children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<any>(undefined)
  const [translatedLanguage, setTranslatedLanguage] = useState<any>(undefined)
  const [translations, setTranslations] = useState<Array<any>>([])

  const getStoredLang = (storedLangCode: string) => {
    return allLanguages.filter((language) => {
      return language.code === storedLangCode
    })[0]
  }

  useEffect(() => {
    const storedLangCode = localStorage.getItem('pancakeSwapLanguage')
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
            setTranslations(['error'])
          } else {
            setTranslations(translationApiResponse.data)
          }
        })
        .then(() => setTranslatedLanguage(selectedLanguage))
        .catch((error) => {
          setTranslations(['error'])
        })
    }
  }, [selectedLanguage, setTranslations])

  return (
    <ThemeProvider theme={isDark ? dark : light}>
      <LanguageContext.Provider
        value={{
          selectedLanguage,
          setSelectedLanguage,
          translatedLanguage,
          setTranslatedLanguage,
        }}
      >
        <TranslationsContext.Provider value={{ translations, setTranslations }}>
          <UseWalletProvider
            chainId={parseInt(process.env.REACT_APP_CHAIN_ID)}
            connectors={{
              walletconnect: { rpcUrl: process.env.REACT_APP_RPC_URL },
            }}
          >
            <BscProvider>
              <SushiProvider>
                <TransactionProvider>
                  <FarmsProvider>
                    <ModalsProvider>{children}</ModalsProvider>
                  </FarmsProvider>
                </TransactionProvider>
              </SushiProvider>
            </BscProvider>
          </UseWalletProvider>
        </TranslationsContext.Provider>
      </LanguageContext.Provider>
    </ThemeProvider>
  )
}

export default Providers
