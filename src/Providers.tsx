/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './theme'
import { UseWalletProvider } from 'use-wallet'
import FarmsProvider from './contexts/Farms'
import ModalsProvider from './contexts/Modals'
import TransactionProvider from './contexts/Transactions'
import SushiProvider from './contexts/SushiProvider'
import BscProvider from './contexts/BscProvider'
import {
  LanguageContext,
  LanguageObject,
} from './contexts/Localisation/languageContext'
import { TranslationsContext } from './contexts/Localisation/translationsContext'

const Providers: React.FC<{
  isDark: boolean
  selectedLanguage: LanguageObject
  setSelectedLanguage: React.Dispatch<React.SetStateAction<LanguageObject>>
  translatedLanguage: LanguageObject
  setTranslatedLanguage: React.Dispatch<React.SetStateAction<LanguageObject>>
  translations: Array<any>
  setTranslations: React.Dispatch<React.SetStateAction<Array<any>>>
}> = ({
  isDark,
  selectedLanguage,
  setSelectedLanguage,
  translatedLanguage,
  setTranslatedLanguage,
  translations,
  setTranslations,
  children,
}) => {
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
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
