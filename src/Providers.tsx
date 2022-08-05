import { ModalProvider, light, dark, MatchBreakpointsProvider } from '@pancakeswap/uikit'
import { Web3ReactProvider } from '@web3-react/core'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { ThemeProvider } from 'styled-components'
import { getLibrary } from 'utils/web3React'
import { LanguageProvider } from 'contexts/Localization'
import { ToastsProvider } from 'contexts/ToastsContext'
import { fetchStatusMiddleware } from 'hooks/useSWRContract'
import { Store } from '@reduxjs/toolkit'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'

const StyledThemeProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const { resolvedTheme } = useNextTheme()
  return <ThemeProvider theme={resolvedTheme === 'dark' ? dark : light} {...props} />
}

const Providers: React.FC<{ store: Store }> = ({ children, store }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <MatchBreakpointsProvider>
          <ToastsProvider>
            <NextThemeProvider>
              <StyledThemeProvider>
                <LanguageProvider>
                  <SWRConfig
                    value={{
                      use: [fetchStatusMiddleware],
                    }}
                  >
                    <ModalProvider>{children}</ModalProvider>
                  </SWRConfig>
                </LanguageProvider>
              </StyledThemeProvider>
            </NextThemeProvider>
          </ToastsProvider>
        </MatchBreakpointsProvider>
      </Provider>
    </Web3ReactProvider>
  )
}

export default Providers
