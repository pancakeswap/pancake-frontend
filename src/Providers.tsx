import React from 'react'
import { ModalProvider } from '@pancakeswap-libs/uikit'
import { UseWalletProvider } from 'use-wallet'
import getRpcUrl from 'utils/getRpcUrl'
import SushiProvider from './contexts/SushiProvider'
import { LanguageContextProvider } from './contexts/Localisation/languageContext'
import { ThemeContextProvider } from './contexts/ThemeContext'
import { BlockContextProvider } from './contexts/BlockContext'
import { DataContextProvider } from './contexts/DataContext'

const Providers: React.FC = ({ children }) => {
  const rpcUrl = getRpcUrl()

  return (
    <ThemeContextProvider>
      <LanguageContextProvider>
        <DataContextProvider>
          <UseWalletProvider
            chainId={parseInt(process.env.REACT_APP_CHAIN_ID)}
            connectors={{
              walletconnect: { rpcUrl },
            }}
          >
            <BlockContextProvider>
              <SushiProvider>
                <ModalProvider>{children}</ModalProvider>
              </SushiProvider>
            </BlockContextProvider>
          </UseWalletProvider>
        </DataContextProvider>
      </LanguageContextProvider>
    </ThemeContextProvider>
  )
}

export default Providers
