import React, { useEffect } from 'react'
import { Box } from '@pancakeswap-libs/uikit'
import { useTheme } from 'styled-components'

const TradingView = () => {
  const theme = useTheme()

  useEffect(() => {
    // @ts-ignore
    if (window.TradingView) {
      /* eslint-disable new-cap */
      /* eslint-disable no-new */
      // @ts-ignore
      new window.TradingView.widget({
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
  }, [theme])

  return (
    <Box overflow="hidden" className="tradingview_container">
      <div id="tradingview_b239c" />
    </Box>
  )
}

export default TradingView
