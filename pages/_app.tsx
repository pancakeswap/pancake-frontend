import type { AppProps } from 'next/app'
import React from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
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
import Providers from '../src/Providers'
import { Updaters, Blocklist } from '../src'
import GlobalStyle from '../src/style/Global'
import Menu from '../src/components/Menu'

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Blocklist>
        <GlobalHooks />
        <Updaters />
        <ResetCSS />
        <GlobalStyle />
        <GlobalCheckClaimStatus excludeLocations={[]} />
        <Menu>
          <Component {...pageProps} />
        </Menu>
        <EasterEgg iterations={2} />
        <ToastListener />
        <SubgraphHealthIndicator />
      </Blocklist>
    </Providers>
  )
}

export default MyApp
