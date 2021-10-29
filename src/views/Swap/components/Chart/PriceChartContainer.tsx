import { Currency } from '@pancakeswap/sdk'
import useTheme from 'hooks/useTheme'
import React, { useCallback, useState } from 'react'
import { useFetchPairPrices, useSwapActionHandlers } from 'state/swap/hooks'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import PriceChart from './PriceChart'
import { getTokenAddress } from './utils'

type PriceChartContainerProps = {
  inputCurrencyId: string
  inputCurrency: Currency
  outputCurrencyId: string
  outputCurrency: Currency
  isChartExpanded: boolean
  setIsChartExpanded: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed: boolean
  isHiddenOnMobile?: boolean
}

const PriceChartContainer: React.FC<PriceChartContainerProps> = ({
  inputCurrencyId,
  inputCurrency,
  outputCurrency,
  outputCurrencyId,
  isChartExpanded,
  setIsChartExpanded,
  isChartDisplayed,
  isHiddenOnMobile = true,
}) => {
  const [timeWindow, setTimeWindow] = useState<PairDataTimeWindowEnum>(0)
  const token0Address = getTokenAddress(inputCurrencyId)
  const token1Address = getTokenAddress(outputCurrencyId)
  const [isPairReversed, setIsPairReversed] = useState(false)
  const togglePairReversed = useCallback(() => setIsPairReversed((prePairReversed) => !prePairReversed), [])

  const { pairPrices, pairId } = useFetchPairPrices({
    token0Address: isPairReversed ? token1Address : token0Address,
    token1Address: isPairReversed ? token0Address : token1Address,
    timeWindow,
  })
  const { isDark } = useTheme()
  const showPriceChart = (!pairPrices || pairPrices.length > 0) && pairId !== null && isChartDisplayed

  return (
    showPriceChart && (
      <PriceChart
        lineChartData={pairPrices}
        timeWindow={timeWindow}
        setTimeWindow={setTimeWindow}
        inputCurrency={isPairReversed ? outputCurrency : inputCurrency}
        outputCurrency={isPairReversed ? inputCurrency : outputCurrency}
        onSwitchTokens={togglePairReversed}
        isDark={isDark}
        isChartExpanded={isChartExpanded}
        setIsChartExpanded={setIsChartExpanded}
        isHiddenOnMobile={isHiddenOnMobile}
      />
    )
  )
}

export default React.memo(PriceChartContainer)
