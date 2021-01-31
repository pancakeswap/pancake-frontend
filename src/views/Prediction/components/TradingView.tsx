import React from 'react'
import styled from 'styled-components'
import TradingViewWidget, { Themes } from 'react-tradingview-widget'
import useTheme from 'hooks/useTheme'

const ChartCard = styled.div`
  flex: 1;
  margin: 24px 0 4px 0;
`

const TradingView = () => {
const { isDark } = useTheme()

  return (
    <ChartCard>
      <TradingViewWidget symbol="BINANCE:BNBUSDT" theme={isDark ? Themes.DARK : Themes.LIGHT} locale="fr" autosize />
    </ChartCard>
  )
}

export default React.memo(TradingView)
