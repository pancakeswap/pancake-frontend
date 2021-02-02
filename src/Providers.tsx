import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { ModalProvider } from '@pancakeswap-libs/uikit'
import { Provider } from 'react-redux'
import getLibrary from 'utils/getLibrary'
import { LanguageContextProvider } from 'contexts/Localisation/languageContext'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { BlockContextProvider } from 'contexts/BlockContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import Web3ReactManager from 'components/Web3ReactManager'
import store from 'state'


const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ThemeContextProvider>
          <LanguageContextProvider>
            <BlockContextProvider>
              <RefreshContextProvider>
                <Web3ReactManager>
                  <ModalProvider>
                      {children}
                  </ModalProvider>
                </Web3ReactManager>
              </RefreshContextProvider>
            </BlockContextProvider>
          </LanguageContextProvider>
        </ThemeContextProvider>
      </Provider>
    </Web3ReactProvider>
  )
}

export default Providers
