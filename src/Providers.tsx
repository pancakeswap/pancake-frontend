import React from 'react'
import { ModalProvider } from '@pancakeswap-libs/uikit'
import ModalsProviderDeprecated from './contexts/Modals'
import { UseWalletProvider } from 'use-wallet'
import FarmsProvider from './contexts/Farms'
import TransactionProvider from './contexts/Transactions'
import SushiProvider from './contexts/SushiProvider'
import BscProvider from './contexts/BscProvider'
import { LanguageContextProvider } from './contexts/Localisation/languageContext'
import { ThemeContextProvider } from './contexts/ThemeContext'

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeContextProvider>
      <LanguageContextProvider>
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
                  <ModalProvider>
                    <ModalsProviderDeprecated>{children}</ModalsProviderDeprecated>
                  </ModalProvider>
                </FarmsProvider>
              </TransactionProvider>
            </SushiProvider>
          </BscProvider>
        </UseWalletProvider>
      </LanguageContextProvider>
    </ThemeContextProvider>
  )
}

export default Providers
