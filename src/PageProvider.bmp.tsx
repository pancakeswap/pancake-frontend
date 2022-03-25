import React, { useState } from 'react'
import { StyleProvider } from 'styled-components'
import { ModalProvider } from '@pancakeswap/uikit'
import { ToastsProvider, ToastListener } from 'contexts/ToastsContext'

import useEagerConnect from 'hooks/useEagerConnect'
import useUserAgent from 'hooks/useUserAgent'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import { AnalyticsProvider } from 'contexts/AnalyticsContext'
import { TooltipListener, TooltipProvider } from 'contexts/bmp/TooltipContext'
import useBmpInit from 'hooks/useBmpInit'
import { useInactiveListener } from './hooks/useInactiveListener'
import { Blocklist, Updaters } from './index'
import { useDidHide, useDidShow } from '@binance/mp-service'

const Hooks = () => {
  usePollBlockNumber()
  useEagerConnect()
  useBmpInit()
  // useFetchProfile()
  // usePollCoreFarmData()
  // useUserAgent()
  // useInactiveListener()
  return <></>
}

const Providers: React.FC = ({ children }) => {
  const [visible, setVisible] = useState(false)
  useDidHide(() => {
    setVisible(false)
  })
  useDidShow(() => {
    setVisible(true)
  })
  return (
    <>
      <StyleProvider />
      <view>
        <AnalyticsProvider>
          <TooltipProvider>
            <ToastsProvider>
              <ModalProvider>
                <Blocklist>
                  <view>
                    {visible && <Updaters />}
                    {visible && <Hooks />}
                  </view>
                  {children}
                  <ToastListener />
                  <TooltipListener />
                </Blocklist>
              </ModalProvider>
            </ToastsProvider>
          </TooltipProvider>
        </AnalyticsProvider>
      </view>
    </>
  )
}

export default Providers
