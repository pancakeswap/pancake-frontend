import { Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useScript from 'hooks/useScript'
import React, { useEffect } from 'react'
import { DefaultTheme, useTheme } from 'styled-components'

// const TRADING_VIEW_COMPONENT_ID = 'tradingview_b239c'

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

const initializeTradingView = (TradingViewObj: any, theme: DefaultTheme, localeCode: string, opts: any) => {
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
    locale: localeCode,
    toolbar_bg: '#f1f3f6',
    enable_publishing: false,
    allow_symbol_change: true,
    hide_side_toolbar: false,
    ...opts,
  })
}

interface TradingViewProps {
  id: string
  symbol: string
}

const TradingView = ({ id, symbol }: TradingViewProps) => {
  const { currentLanguage } = useTranslation()
  const theme = useTheme()

  useScript('https://s3.tradingview.com/tv.js')

  useEffect(() => {
    const opts = {
      container_id: id,
      symbol,
    }
    // @ts-ignore
    if (window.tv) {
      // @ts-ignore
      initializeTradingView(window.tv, theme, currentLanguage.code, opts)
    } else {
      tradingViewListener().then((tv) => {
        initializeTradingView(tv, theme, currentLanguage.code, opts)
      })
    }
  }, [theme, currentLanguage, id, symbol])

  return (
    <Box overflow="hidden" className="tradingview_container">
      <div id={id} />
    </Box>
  )
}

export default TradingView
