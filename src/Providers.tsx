import { ModalProvider, light, dark, MatchBreakpointsProvider } from '@pancakeswap/uikit'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { ThemeProvider } from 'styled-components'
import { LanguageProvider } from '@pancakeswap/localization'
import { ToastsProvider } from 'contexts/ToastsContext'
import { fetchStatusMiddleware } from 'hooks/useSWRContract'
import { Store } from '@reduxjs/toolkit'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'
import { WagmiProvider } from '@pancakeswap/wagmi'
import { client } from 'utils/wagmi'
import { HistoryManagerProvider } from 'contexts/HistoryContext'

const StyledThemeProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const { resolvedTheme } = useNextTheme()
  return <ThemeProvider theme={resolvedTheme === 'dark' ? dark : light} {...props} />
}

const Providers: React.FC<{ store: Store }> = ({ children, store }) => {
  return (
    <WagmiProvider client={client}>
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
                    <HistoryManagerProvider>
                      <ModalProvider>{children}</ModalProvider>
                    </HistoryManagerProvider>
                  </SWRConfig>
                </LanguageProvider>
              </StyledThemeProvider>
            </NextThemeProvider>
          </ToastsProvider>
        </MatchBreakpointsProvider>
      </Provider>
    </WagmiProvider>
  )
}

export default Providers
