import React from 'react'
import styled from 'styled-components'
import TradingViewWidget, { Themes } from 'react-tradingview-widget'

const ChartCard = styled.div`
  flex: 1;
  margin: 24px 0 4px 0;
`

const TradingView = () => {
  return (
    <ChartCard>
      <TradingViewWidget symbol="BINANCE:BNBUSDT" theme={Themes.DARK} locale="fr" autosize />
    </ChartCard>
  )
}

export default React.memo(TradingView)
