import '@pancakeswap/ui/css/reset.css'
import '../css/theme.css'

import BigNumber from 'bignumber.js'
import { PancakeTheme, ResetCSS, ToastListener } from '@pancakeswap/uikit'
import { Analytics } from '@vercel/analytics/react'
import { Menu } from 'components/Menu'
import Providers from 'components/Providers'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { SEO } from 'next-seo.config'
import { Fragment } from 'react'
import ListsUpdater from 'state/lists/updater'
import TransactionUpdater from 'state/transactions/updater'
import { WrongNetworkModal } from 'components/WrongNetworkModal'

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <TransactionUpdater />
    </>
  )
}

function GlobalHooks() {
  return null
}

function MyApp(props: AppProps) {
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
      <Providers>
        <GlobalHooks />
        <ResetCSS />
        <Updaters />
        <App {...props} />
        <ToastListener />
      </Providers>
      <Analytics />
      {process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
        />
      )}
      {process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      )}
    </>
  )
}

type NextPageWithLayout = NextPage & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>
  /** render component without all layouts */
  pure?: true
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  if (Component.pure) {
    return <Component {...pageProps} />
  }

  // Use the layout defined at the page level, if available
  const Layout = Component.Layout || Fragment
  const ShowMenu = Menu

  return (
    <>
      <ShowMenu>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ShowMenu>
      <WrongNetworkModal />
      <ToastListener />
    </>
  )
}

export default MyApp
