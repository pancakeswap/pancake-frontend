import '@pancakeswap/ui/css/reset.css'
import '../css/theme.css'

import { PancakeTheme, ResetCSS, ToastListener } from '@pancakeswap/uikit'
import { Menu } from 'components/Menu'
import Providers from 'components/Providers'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { DefaultSeo } from 'next-seo'
import { SEO } from 'next-seo.config'
import { Fragment } from 'react'
import { useStore } from 'state'
import ListsUpdater from 'state/lists/updater'
import TransactionUpdater from 'state/transactions/updater'
import { WrongNetworkModal } from 'components/WrongNetworkModal'

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

function MyApp(props: AppProps<{ initialReduxState: any }>) {
  const { pageProps } = props
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
      <Providers store={store}>
        <GlobalHooks />
        <ResetCSS />
        <Updaters />
        <App {...props} />
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
      <WrongNetworkModal />
      <ToastListener />
    </>
  )
}

export default MyApp
