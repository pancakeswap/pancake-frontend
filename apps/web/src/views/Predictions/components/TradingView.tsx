import TradingViewChart from 'components/TradingView'

const TRADING_VIEW_COMPONENT_ID = 'tradingview_b239c'

const TradingView = () => {
  return <TradingViewChart id={TRADING_VIEW_COMPONENT_ID} symbol="BINANCE:BNBUSD" />
}

export default TradingView
