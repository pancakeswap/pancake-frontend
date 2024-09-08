import { Box, FlexProps, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Script from 'next/script'
import { useEffect } from 'react'
import { DefaultTheme, useTheme } from 'styled-components'
import { ChartByLabel } from './Chart/ChartbyLabel'

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
  let timezone = 'Etc/UTC'
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (e) {
    // noop
  }
  /* eslint-disable new-cap */
  /* eslint-disable no-new */
  // @ts-ignore
  return new TradingViewObj.widget({
    // Advanced Chart Widget uses the legacy embedding scheme,
    // an id property should be specified in the settings object
    id: opts.container_id,
    autosize: true,
    height: '100%',
    symbol: 'BINANCE:BNBBUSD',
    interval: '5',
    timezone,
    theme: theme.isDark ? 'dark' : 'light',
    style: '1',
    locale: localeCode,
    toolbar_bg: '#f1f3f6',
    enable_publishing: false,
    allow_symbol_change: true,
    hide_side_toolbar: false,
    enabled_features: ['header_fullscreen_button'],
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
  const { isMobile } = useMatchBreakpoints()

  useEffect(() => {
    const opts: any = {
      container_id: id,
      symbol,
    }

    if (isMobile) {
      opts.hide_side_toolbar = true
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

    // Ignore isMobile to avoid re-render TV
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, currentLanguage, id, symbol])

  return (
    <Box overflow="hidden" className="tradingview_container">
      <Script
        src="https://s3.tradingview.com/tv.js"
        integrity="sha256-kYIDvJ8KAurvEZgYL7xBP19dqfZsI978rTedCEmYTk4="
        crossOrigin="anonymous"
        strategy="lazyOnload"
        id="tv.js"
      />
      <div id={id} />
    </Box>
  )
}

export function useTradingViewEvent({
  id,
  onNoDataEvent,
  onLoadedEvent,
}: {
  id?: string
  onNoDataEvent?: () => void
  onLoadedEvent?: () => void
}) {
  useEffect(() => {
    const onNoDataAvailable = (event: MessageEvent) => {
      const payload = event.data

      if (payload.name === 'tv-widget-no-data') {
        if (id && payload.frameElementId === id) {
          onNoDataEvent?.()
        }
      }
      if (payload.name === 'tv-widget-load') {
        if (id && payload.frameElementId === id) {
          onLoadedEvent?.()
        }
      }
    }
    window.addEventListener('message', onNoDataAvailable)

    return () => {
      window.removeEventListener('message', onNoDataAvailable)
    }
  }, [id, onNoDataEvent, onLoadedEvent])
}

// Required to link to TradingView website for the widget
export const TradingViewLabel = ({ symbol, ...props }: { symbol: string } & FlexProps) => {
  return (
    <ChartByLabel link={`https://www.tradingview.com/symbols/${symbol}`} symbol={symbol} by="TradingView" {...props} />
  )
}

export default TradingView
