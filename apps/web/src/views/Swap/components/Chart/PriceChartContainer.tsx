import { Currency, WNATIVE } from '@pancakeswap/sdk'
import useTheme from 'hooks/useTheme'
import { useCallback, useState } from 'react'
import BnbWbnbNotice from './BnbWbnbNotice'
import PriceChart from './PriceChart'

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
  isFullWidthContainer?: boolean
}

const PriceChartContainer: React.FC<React.PropsWithChildren<PriceChartContainerProps>> = ({
  inputCurrency,
  outputCurrency,
  isChartExpanded,
  setIsChartExpanded,
  isChartDisplayed,
  isMobile,
  isFullWidthContainer = false,
  currentSwapPrice,
}) => {
  const token0Address = inputCurrency?.wrapped.address?.toLocaleLowerCase()
  const token1Address = outputCurrency?.wrapped.address?.toLocaleLowerCase()
  const [isPairReversed, setIsPairReversed] = useState(false)
  const togglePairReversed = useCallback(() => setIsPairReversed((prePairReversed) => !prePairReversed), [])

  const { isDark } = useTheme()

  if (!isChartDisplayed) {
    return null
  }

  const isWrap =
    inputCurrency &&
    outputCurrency &&
    WNATIVE[inputCurrency.chainId].equals(inputCurrency.wrapped) &&
    WNATIVE[outputCurrency.chainId].equals(outputCurrency.wrapped)

  if (isWrap) {
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
      isFullWidthContainer={isFullWidthContainer}
      currentSwapPrice={currentSwapPrice}
    />
  )
}

export default PriceChartContainer
