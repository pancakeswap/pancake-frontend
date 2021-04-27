import React, { useEffect } from 'react'
import { Box } from '@pancakeswap-libs/uikit'
import { DefaultTheme, useTheme } from 'styled-components'

/**
 * When the script tag is injected the TradingView object is not immediately
 * available on the window. So we listen for when it gets set
 */
const tradingViewListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'TradingView', {
      configurable: true,
      set(value) {
        this.tv = value
        resolve(value)
      },
    }),
  )

const initializeTradingView = (TradingViewObj: any, theme: DefaultTheme) => {
  /* eslint-disable new-cap */
  /* eslint-disable no-new */
  // @ts-ignore
  new TradingViewObj.widget({
    autosize: true,
    height: '100%',
    symbol: 'BINANCE:BNBUSDT',
    interval: '5',
    timezone: 'Etc/UTC',
    theme: theme.isDark ? 'dark' : 'light',
    style: '1',
    locale: 'en',
    toolbar_bg: '#f1f3f6',
    enable_publishing: false,
    allow_symbol_change: true,
    container_id: 'tradingview_b239c',
  })
}

const TradingView = () => {
  const theme = useTheme()

  useEffect(() => {
    // @ts-ignore
    if (window.TradingView) {
      // @ts-ignore
      initializeTradingView(window.TradingView, theme)
    } else {
      tradingViewListener().then((tv) => {
        initializeTradingView(tv, theme)
      })
    }
  }, [theme])

  return (
    <Box overflow="hidden" className="tradingview_container">
      <div id="tradingview_b239c" />
    </Box>
  )
}

export default TradingView
