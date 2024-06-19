import { AwgmiConfig } from '@pancakeswap/awgmi'
import { LanguageProvider } from '@pancakeswap/localization'
import { DialogProvider, ModalProvider, UIKitProvider, dark, light } from '@pancakeswap/uikit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'
import { client } from '../client'

const StyledUIKitProvider: React.FC<React.PropsWithChildren> = ({ children, ...props }) => {
  const { resolvedTheme } = useNextTheme()
  return (
    <UIKitProvider theme={resolvedTheme === 'dark' ? dark : light} {...props}>
      {children}
    </UIKitProvider>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: {
      networkMode: 'offlineFirst',
    },
  },
})

const Providers: React.FC<React.PropsWithChildren<{ children: React.ReactNode }>> = ({ children }) => {
  return (
    <AwgmiConfig client={client}>
      <QueryClientProvider client={queryClient}>
        <NextThemeProvider>
          <StyledUIKitProvider>
            <LanguageProvider>
              <ModalProvider portalProvider={DialogProvider}>{children}</ModalProvider>
            </LanguageProvider>
          </StyledUIKitProvider>
        </NextThemeProvider>
      </QueryClientProvider>
    </AwgmiConfig>
  )
}

export default Providers
