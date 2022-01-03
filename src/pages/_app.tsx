import type { AppProps } from 'next/app'
import React from 'react'
import BigNumber from 'bignumber.js'
import { ResetCSS } from '@pancakeswap/uikit'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import useEagerConnect from 'hooks/useEagerConnect'
import useUserAgent from 'hooks/useUserAgent'
import { useInactiveListener } from 'hooks/useInactiveListener'
import { useFetchProfile } from 'state/profile/hooks'
import useSentryUser from 'hooks/useSentryUser'
import useNftClaimStatusCheck from 'hooks/useNftClaimStatusCheck'
import { ToastListener } from 'contexts/ToastsContext'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import EasterEgg from 'components/EasterEgg'
import GlobalCheckClaimStatus from 'components/GlobalCheckClaimStatus'
import Providers from '../Providers'
import { Updaters, Blocklist } from '..'
import GlobalStyle from '../style/Global'
import Menu from '../components/Menu'

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
    <Providers>
      <Blocklist>
        <GlobalHooks />
        <Updaters />
        <ResetCSS />
        <GlobalStyle />
        <GlobalCheckClaimStatus excludeLocations={[]} />
        <Menu>
          <App {...props} />
        </Menu>
        <EasterEgg iterations={2} />
        <ToastListener />
        <SubgraphHealthIndicator />
      </Blocklist>
    </Providers>
  )
}

const App = ({ Component, pageProps }: AppProps) => {
  // Use the layout defined at the page level, if available
  // @ts-ignore
  const getLayout = Component.getLayout || ((page) => page)
  return <Menu>{getLayout(<Component {...pageProps} />)}</Menu>
}

export default MyApp
