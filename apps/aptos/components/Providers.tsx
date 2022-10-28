import { ModalProvider, light, dark, UIKitProvider } from '@pancakeswap/uikit'
import { SWRConfig } from 'swr'
import { LanguageProvider } from '@pancakeswap/localization'
import { AwgmiConfig } from '@pancakeswap/awgmi'
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

const Providers: React.FC<React.PropsWithChildren<{ children: React.ReactNode }>> = ({ children }) => {
  return (
    <AwgmiConfig client={client}>
      <NextThemeProvider>
        <StyledUIKitProvider>
          <LanguageProvider>
            <SWRConfig>
              <ModalProvider>{children}</ModalProvider>
            </SWRConfig>
          </LanguageProvider>
        </StyledUIKitProvider>
      </NextThemeProvider>
    </AwgmiConfig>
  )
}

export default Providers
