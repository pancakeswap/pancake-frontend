import React from 'react'
import { ModalProvider } from '@pancakeswap-libs/uikit'
import { UseWalletProvider } from 'use-wallet'
import getRpcUrl from 'utils/getRpcUrl'
import TransactionProvider from './contexts/Transactions'
import SushiProvider from './contexts/SushiProvider'
import { LanguageContextProvider } from './contexts/Localisation/languageContext'
import { ThemeContextProvider } from './contexts/ThemeContext'
import { BlockContextProvider } from './contexts/BlockContext'

const Providers: React.FC = ({ children }) => {
  const rpcUrl = getRpcUrl()

  return (
    <ThemeContextProvider>
      <LanguageContextProvider>
        <UseWalletProvider
          chainId={parseInt(process.env.REACT_APP_CHAIN_ID)}
          connectors={{
            walletconnect: { rpcUrl },
          }}
        >
          <BlockContextProvider>
            <SushiProvider>
              <TransactionProvider>
                <ModalProvider>{children}</ModalProvider>
              </TransactionProvider>
            </SushiProvider>
          </BlockContextProvider>
        </UseWalletProvider>
      </LanguageContextProvider>
    </ThemeContextProvider>
  )
}

export default Providers
