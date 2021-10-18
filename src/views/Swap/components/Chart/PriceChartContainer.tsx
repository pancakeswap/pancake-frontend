import useTheme from 'hooks/useTheme'
import React, { useState } from 'react'
import { useFetchPairPrices, useSwapActionHandlers } from 'state/swap/hooks'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import { DEFAULT_INPUT_ADDRESS } from './constants'
import PriceChart from './PriceChart'

const PriceChartContainer = ({
  inputCurrencyId,
  inputCurrency,
  outputCurrency,
  outputCurrencyId,
  isChartExpanded,
  setIsChartExpanded,
}) => {
  const [timeWindow, setTimeWindow] = useState<PairDataTimeWindowEnum>(0)
  const token0Address =
    inputCurrencyId && inputCurrencyId !== 'BNB' ? String(inputCurrencyId).toLowerCase() : DEFAULT_INPUT_ADDRESS
  const token1Address = outputCurrencyId ? String(outputCurrencyId).toLowerCase() : ''

  const { pairPrices, isPairReversed } = useFetchPairPrices({ token0Address, token1Address, timeWindow })
  const { onSwitchTokens } = useSwapActionHandlers()
  const { isDark } = useTheme()

  const mockPairPrices = [
    { time: new Date(Date.now() + 1000), value: 50 },
    { time: new Date(Date.now() + 2000), value: 60 },
    { time: new Date(Date.now() + 3000), value: 55 },
    { time: new Date(Date.now() + 4000), value: 70 },
    { time: new Date(Date.now() + 5000), value: 68 },
    { time: new Date(Date.now() + 6000), value: 80 },
    { time: new Date(Date.now() + 7000), value: 90 },
  ]

  return (
    <PriceChart
      lineChartData={pairPrices}
      timeWindow={timeWindow}
      setTimeWindow={setTimeWindow}
      inputCurrency={inputCurrency}
      outputCurrency={outputCurrency}
      onSwitchTokens={onSwitchTokens}
      isDark={isDark}
      isPairReversed={isPairReversed}
      isChartExpanded={isChartExpanded}
      setIsChartExpanded={setIsChartExpanded}
    />
  )
}

export default PriceChartContainer
