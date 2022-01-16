import TradingViewChart from 'components/TradingView'
import React from 'react'

const TRADING_VIEW_COMPONENT_ID = 'tradingview_b239c'

const TradingView = () => {
  return <TradingViewChart id={TRADING_VIEW_COMPONENT_ID} symbol="BINANCE:BNBUSDT" />
}

export default TradingView
