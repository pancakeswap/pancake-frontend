import { Currency } from '@pancakeswap/sdk'
import useTheme from 'hooks/useTheme'
import React, { useCallback, useState } from 'react'
import { useFetchPairPrices } from 'state/swap/hooks'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import NoChartAvailable from './NoChartAvailable'
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
  currentSwapPrice: {
    [key: string]: number
  }
  isMobile?: boolean
}

const PriceChartContainer: React.FC<PriceChartContainerProps> = ({
  inputCurrencyId,
  inputCurrency,
  outputCurrency,
  outputCurrencyId,
  isChartExpanded,
  setIsChartExpanded,
  isChartDisplayed,
  currentSwapPrice,
  isMobile,
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
    currentSwapPrice,
  })
  const { isDark } = useTheme()

  if (!isChartDisplayed) {
    return null
  }

  // Sometimes we might receive array full of zeros for obscure tokens while trying to derive data
  // In that case chart is not useful to users
  const isBadData =
    pairPrices &&
    pairPrices.length > 0 &&
    pairPrices.every(
      (price) => !price.value || price.value === 0 || price.value === Infinity || Number.isNaN(price.value),
    )

  // If results did came back but as empty array - there is no data to display
  if ((!!pairPrices && pairPrices.length === 0) || isBadData || !pairId) {
    return (
      <NoChartAvailable
        isDark={isDark}
        isChartExpanded={isChartExpanded}
        token0Address={token0Address}
        token1Address={token1Address}
        pairAddress={pairId}
        isMobile={isMobile}
      />
    )
  }

  return (
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
      isMobile={isMobile}
    />
  )
}

export default React.memo(PriceChartContainer)
