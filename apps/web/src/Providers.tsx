import { LanguageProvider } from '@pancakeswap/localization'
import { ModalProvider, UIKitProvider, dark, light } from '@pancakeswap/uikit'
import { Store } from '@reduxjs/toolkit'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HistoryManagerProvider } from 'contexts/HistoryContext'
import { fetchStatusMiddleware } from 'hooks/useSWRContract'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { wagmiConfig } from 'utils/wagmi'
import { WagmiConfig } from 'wagmi'

// Create a client
const queryClient = new QueryClient()

const StyledUIKitProvider: React.FC<React.PropsWithChildren> = ({ children, ...props }) => {
  const { resolvedTheme } = useNextTheme()
  return (
    <UIKitProvider theme={resolvedTheme === 'dark' ? dark : light} {...props}>
      {children}
    </UIKitProvider>
  )
}

const Providers: React.FC<
  React.PropsWithChildren<{ store: Store; children: React.ReactNode; dehydratedState: any }>
> = ({ children, store, dehydratedState }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <WagmiConfig config={wagmiConfig}>
          <Provider store={store}>
            <NextThemeProvider>
              <LanguageProvider>
                <StyledUIKitProvider>
                  <SWRConfig
                    value={{
                      use: [fetchStatusMiddleware],
                    }}
                  >
                    <HistoryManagerProvider>
                      <ModalProvider>{children}</ModalProvider>
                    </HistoryManagerProvider>
                  </SWRConfig>
                </StyledUIKitProvider>
              </LanguageProvider>
            </NextThemeProvider>
          </Provider>
        </WagmiConfig>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default Providers
