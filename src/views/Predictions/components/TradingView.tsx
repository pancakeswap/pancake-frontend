import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@pancakeswap-libs/uikit'
import { useTheme } from 'styled-components'

const TradingView = () => {
  const [hasInjectedScript, setHasInjectedScript] = useState(false)
  const tv = useRef(null)
  const theme = useTheme()

  useEffect(() => {
    // Check if we have loaded the script already
    const scriptEle = document.getElementById('tradingViewWidget')

    if (!scriptEle) {
      const script = document.createElement('script')

      if (!hasInjectedScript) {
        script.setAttribute('src', 'https://s3.tradingview.com/tv.js')
        script.setAttribute('type', 'text/javascript')
        script.setAttribute('id', 'tradingViewWidget')

        script.addEventListener('load', () => {
          setHasInjectedScript(true)
        })

        document.getElementsByTagName('head')[0].appendChild(script)
      }
    } else {
      setHasInjectedScript(true)
    }
  }, [hasInjectedScript, setHasInjectedScript, theme])

  useEffect(() => {
    if (hasInjectedScript) {
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
    }
  }, [tv, hasInjectedScript, theme])

  return (
    <Box overflow="hidden" className="tradingview_container">
      <div id="tradingview_b239c" />
    </Box>
  )
}

export default TradingView
