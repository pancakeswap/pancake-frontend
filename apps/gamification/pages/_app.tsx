import { LanguageProvider } from '@pancakeswap/localization'
import { ModalProvider, PancakeTheme, ResetCSS, ToastListener, UIKitProvider, dark, light } from '@pancakeswap/uikit'
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { NetworkModal } from 'components/NetworkModal'
import { useAccountEventListener } from 'hooks/useAccountEventListener'
import { useAutoSiwe as useAutoDashboardSiwe } from 'hooks/useDashboardSiwe'
import { useAutoSiwe } from 'hooks/useSiwe'
import { NextPage } from 'next'
import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'
import { SEO } from 'next-seo.config'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Script from 'next/script'
import React, { Fragment, ReactNode, useMemo } from 'react'
import { Provider } from 'react-redux'
import { Provider as WrapBalancerProvider } from 'react-wrap-balancer'
import { useStore } from 'state'
import { createGlobalStyle } from 'styled-components'
import { createWagmiConfig } from 'utils/wagmi'
import { WagmiProvider } from 'wagmi'
import Menu from '../components/Menu/index'

function GlobalHooks() {
  useAccountEventListener()
  useAutoSiwe()
  useAutoDashboardSiwe()
  return null
}

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

// Create a client
const queryClient = new QueryClient()

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const StyledThemeProvider: React.FC<React.PropsWithChildren> = (props) => {
  const { resolvedTheme } = useNextTheme()
  return (
    <UIKitProvider theme={resolvedTheme === 'dark' ? dark : light} {...props}>
      {props.children}
    </UIKitProvider>
  )
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Kanit', sans-serif;
  }
  html, body {
    height: 100%;
  }
  #__next {
    display: flex;
    flex-direction: column;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
    overflow-x: hidden;

    img {
      height: auto;
      max-width: 100%;
    }
  }
`
type NextPageWithLayout = NextPage & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>
  /** render component without all layouts */
  pure?: true
  chains?: number[]

  CustomComponent?: ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component.Layout || Fragment
  const wagmiConfig = useMemo(() => createWagmiConfig(), [])
  const store = useStore(pageProps.initialReduxState)

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#1FC7D4" />
      </Head>
      <DefaultSeo {...SEO} />
      <WagmiProvider reconnectOnMount config={wagmiConfig}>
        <SessionProvider session={pageProps.session}>
          <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={pageProps.dehydratedState}>
              <Provider store={store}>
                <NextThemeProvider>
                  <StyledThemeProvider>
                    <LanguageProvider>
                      <ModalProvider>
                        <ResetCSS />
                        <GlobalStyle />
                        <GlobalHooks />
                        <Menu>
                          <Layout>
                            <WrapBalancerProvider>
                              <Component {...pageProps} />
                            </WrapBalancerProvider>
                          </Layout>
                        </Menu>
                        <ToastListener />
                        <NetworkModal pageSupportedChains={Component.chains} />
                        {Component?.CustomComponent}
                      </ModalProvider>
                    </LanguageProvider>
                  </StyledThemeProvider>
                </NextThemeProvider>
              </Provider>
            </HydrationBoundary>
          </QueryClientProvider>
        </SessionProvider>
      </WagmiProvider>
      <Script
        strategy="afterInteractive"
        id="google-tag"
        dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer', '${process.env.NEXT_PUBLIC_GTM}');
        `,
        }}
      />
    </>
  )
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
})
