import { ResetCSS } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import EasterEgg from 'components/EasterEgg'
import GlobalCheckClaimStatus from 'components/GlobalCheckClaimStatus'
import PageLoader from 'components/Loader/PageLoader'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import { ToastListener } from 'contexts/ToastsContext'
import useEagerConnect from 'hooks/useEagerConnect'
import { useInactiveListener } from 'hooks/useInactiveListener'
import useNftClaimStatusCheck from 'hooks/useNftClaimStatusCheck'
import useSentryUser from 'hooks/useSentryUser'
import useUserAgent from 'hooks/useUserAgent'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from 'state'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import { Blocklist, Updaters } from '..'
import Menu from '../components/Menu'
import Providers from '../Providers'
import GlobalStyle from '../style/Global'

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

function GlobalHooks() {
  usePollBlockNumber()
  useEagerConnect()
  useFetchProfile()
  usePollCoreFarmData()
  useUserAgent()
  useInactiveListener()
  useSentryUser()
  useNftClaimStatusCheck()
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
        <title>PancakeSwap</title>
      </Head>
      <Providers>
        <PersistGate loading={<PageLoader />} persistor={persistor}>
          <Blocklist>
            <GlobalHooks />
            <Updaters />
            <ResetCSS />
            <GlobalStyle />
            <GlobalCheckClaimStatus excludeLocations={[]} />
            <App {...props} />
            <EasterEgg iterations={2} />
            <ToastListener />
            <SubgraphHealthIndicator />
          </Blocklist>
        </PersistGate>
      </Providers>
    </>
  )
}

const App = ({ Component, pageProps }: AppProps) => {
  // Use the layout defined at the page level, if available
  // @ts-ignore
  const getLayout = Component.getLayout || ((page) => page)
  return <Menu>{getLayout(<Component {...pageProps} />)}</Menu>
}

export default MyApp
