import { LanguageProvider } from '@pancakeswap/localization'
import { ModalProvider, UIKitProvider, dark, light } from '@pancakeswap/uikit'
import { Provider } from 'jotai'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'

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
    <NextThemeProvider>
      <LanguageProvider>
        <StyledUIKitProvider>
          <Provider>
            <ModalProvider>{children}</ModalProvider>
          </Provider>
        </StyledUIKitProvider>
      </LanguageProvider>
    </NextThemeProvider>
  )
}

export default Providers
