import { useHealthy } from '@pancakeswap/awgmi'
import '@pancakeswap/ui/css/reset.css'
import { PancakeTheme, ResetCSS, ToastListener } from '@pancakeswap/uikit'
import { Menu } from 'components/Menu'
import Providers from 'components/Providers'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { useStore } from 'state'
import ListsUpdater from 'state/lists/updater'
import TransactionUpdater from 'state/transactions/updater'
import { NextPage } from 'next'
import { Fragment } from 'react'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

function HealthyLog() {
  useHealthy({
    onError: (err) => {
      console.info(err)
    },
  })
  return null
}

function Updaters() {
  return (
    <>
      <ListsUpdater />
      <TransactionUpdater />
      <HealthyLog />
    </>
  )
}

function GlobalHooks() {
  return null
}

function MyApp({ Component, pageProps }: AppProps<{ initialReduxState: any }>) {
  const store = useStore(pageProps.initialReduxState)
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <meta
          name="description"
          content="Cheaper and faster than Uniswap? Discover PancakeSwap, the leading DEX on BNB Smart Chain (BSC) with the best farms in DeFi and a lottery for CAKE."
        />
        <meta name="theme-color" content="#1FC7D4" />
        <meta name="twitter:image" content="https://pancakeswap.finance/images/hero.png" />
        <meta
          name="twitter:description"
          content="The most popular AMM on BSC! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PancakeSwap), NFTs, and more, on a platform you can trust."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="🥞 PancakeSwap - A next evolution DeFi exchange on BNB Smart Chain (BSC)" />
        <title>PancakeSwap</title>
      </Head>
      <Providers store={store}>
        <GlobalHooks />
        <ResetCSS />
        <Updaters />
        <App Component={Component} pageProps={pageProps} />
        <ToastListener />
      </Providers>
      <Script
        strategy="afterInteractive"
        id="google-tag"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${process.env.NEXT_PUBLIC_GTAG}');
          `,
        }}
      />
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
      <ToastListener />
    </>
  )
}

export default MyApp
