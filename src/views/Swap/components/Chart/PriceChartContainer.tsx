import { Currency } from '@pancakeswap/sdk'
import useTheme from 'hooks/useTheme'
import React, { useCallback, useState } from 'react'
import BnbWbnbNotice from './BnbWbnbNotice'
import { BNB_ADDRESS } from './constants'
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
  isMobile,
  currentSwapPrice,
}) => {
  const token0Address = getTokenAddress(inputCurrencyId)
  const token1Address = getTokenAddress(outputCurrencyId)
  const [isPairReversed, setIsPairReversed] = useState(false)
  const togglePairReversed = useCallback(() => setIsPairReversed((prePairReversed) => !prePairReversed), [])

  const { isDark } = useTheme()

  if (!isChartDisplayed) {
    return null
  }

  const isBnbWbnb = token0Address === BNB_ADDRESS && token1Address === BNB_ADDRESS

  if (isBnbWbnb) {
    return <BnbWbnbNotice isDark={isDark} isChartExpanded={isChartExpanded} />
  }

  return (
    <PriceChart
      token0Address={isPairReversed ? token1Address : token0Address}
      token1Address={isPairReversed ? token0Address : token1Address}
      inputCurrency={isPairReversed ? outputCurrency : inputCurrency}
      outputCurrency={isPairReversed ? inputCurrency : outputCurrency}
      onSwitchTokens={togglePairReversed}
      isDark={isDark}
      isChartExpanded={isChartExpanded}
      setIsChartExpanded={setIsChartExpanded}
      isMobile={isMobile}
      currentSwapPrice={currentSwapPrice}
    />
  )
}

export default React.memo(PriceChartContainer, (prev, next) => {
  const prevToken0Address = getTokenAddress(prev.inputCurrencyId)
  const nextToken0Address = getTokenAddress(next.inputCurrencyId)
  const prevToken1Address = getTokenAddress(prev.outputCurrencyId)
  const nextToken1Address = getTokenAddress(next.outputCurrencyId)

  return (
    prev.inputCurrencyId === next.inputCurrencyId &&
    prev.outputCurrencyId === next.outputCurrencyId &&
    prev.isChartExpanded === next.isChartExpanded &&
    prev.isChartDisplayed === next.isChartDisplayed &&
    prev.isMobile === next.isMobile &&
    prev.setIsChartExpanded === next.setIsChartExpanded &&
    ((prev.currentSwapPrice !== null &&
      next.currentSwapPrice !== null &&
      prev.currentSwapPrice[prevToken0Address] === next.currentSwapPrice[nextToken0Address] &&
      prev.currentSwapPrice[prevToken1Address] === next.currentSwapPrice[nextToken1Address]) ||
      (prev.currentSwapPrice === null && next.currentSwapPrice === null))
  )
})
