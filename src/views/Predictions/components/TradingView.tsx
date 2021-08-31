import React, { useEffect } from 'react'
import { Box } from '@pancakeswap/uikit'
import { DefaultTheme, useTheme } from 'styled-components'
import debounce from 'lodash/debounce'
import { useTranslation } from 'contexts/Localization'
import useLastUpdated from 'hooks/useLastUpdated'

const TRADING_VIEW_COMPONENT_ID = 'tradingview_b239c'

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

const initializeTradingView = (TradingViewObj: any, theme: DefaultTheme, localeCode: string) => {
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
    container_id: TRADING_VIEW_COMPONENT_ID,
  })
}

const TradingView = () => {
  const { currentLanguage } = useTranslation()
  const theme = useTheme()
  const { lastUpdated, setLastUpdated } = useLastUpdated()

  useEffect(() => {
    const ele = document.getElementById(TRADING_VIEW_COMPONENT_ID)

    const debouncedOnResize = debounce(() => {
      setLastUpdated()
    }, 500)

    const resizeObserver = new ResizeObserver(() => {
      debouncedOnResize()
    })

    resizeObserver.observe(ele)

    return () => {
      resizeObserver.unobserve(ele)
    }
  }, [setLastUpdated])

  useEffect(() => {
    // @ts-ignore
    if (window.tv) {
      // @ts-ignore
      initializeTradingView(window.tv, theme, currentLanguage.code)
    } else {
      tradingViewListener().then((tv) => {
        initializeTradingView(tv, theme, currentLanguage.code)
      })
    }
  }, [theme, currentLanguage, lastUpdated])

  return (
    <Box overflow="hidden" className="tradingview_container">
      <div id={TRADING_VIEW_COMPONENT_ID} />
    </Box>
  )
}

export default TradingView
