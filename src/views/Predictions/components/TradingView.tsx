import React, { useEffect, useRef } from 'react'
import { Box } from '@pancakeswap-libs/uikit'
import { useTheme } from 'styled-components'

const TradingView = () => {
  const hasLoadedScript = useRef(false)
  const tv = useRef(null)
  const theme = useTheme()

  useEffect(() => {
    const script = document.createElement('script')

    if (!hasLoadedScript.current) {
      script.setAttribute('src', 'https://s3.tradingview.com/tv.js')
      script.setAttribute('type', 'text/javascript')

      script.addEventListener('load', () => {
        /* eslint-disable new-cap */
        // @ts-ignore
        tv.current = new window.TradingView.widget({
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
        hasLoadedScript.current = true
      })

      document.getElementsByTagName('head')[0].appendChild(script)
    }

    return () => {
      script.remove()
    }
  }, [tv, hasLoadedScript, theme])

  return (
    <Box overflow="hidden" className="tradingview_container">
      <div id="tradingview_b239c" />
    </Box>
  )
}

export default TradingView
