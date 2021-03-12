import React, { useEffect, useState } from 'react'

const TradingView = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')

    script.setAttribute('src', 'https://s3.tradingview.com/tv.js')
    script.setAttribute('type', 'text/javascript')

    script.addEventListener('load', () => {
      /* eslint-disable new-cap */
      /* eslint-disable no-new */
      // @ts-ignore
      new window.TradingView.widget({
        width: '100%',
        height: 610,
        symbol: 'BINANCE:BNBUSDT',
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'light',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: 'tradingview_d253d',
      })
    })

    document.getElementsByTagName('head')[0].appendChild(script)
  }, [setIsMounted])

  return (
    <div className="tradingview_container">
      <div id="tradingview_d253d" />
    </div>
  )
}

export default TradingView
