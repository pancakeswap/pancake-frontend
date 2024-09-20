import { Currency } from '@pancakeswap/sdk'
import { BottomDrawer, Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

import { useCurrency } from 'hooks/Tokens'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { Field } from 'state/swap/actions'
import { useSingleTokenSwapInfo, useSwapState } from 'state/swap/hooks'
import { styled } from 'styled-components'
import Page from '../Page'
import PriceChartContainer from '../Swap/components/Chart/PriceChartContainer'
import { StyledSwapContainer } from '../Swap/styles'
import { SwapFeaturesContext } from '../Swap/SwapFeaturesContext'
import { V4SwapForm } from './V4Swap'

const Wrapper = styled(Box)`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 480px;
  }
`

export default function V4Swap() {
  const { query } = useRouter()
  const { isDesktop } = useMatchBreakpoints()
  const {
    isChartExpanded,
    isChartDisplayed,
    setIsChartDisplayed,
    setIsChartExpanded,
    isChartSupported,
    // isHotTokenSupported,
  } = useContext(SwapFeaturesContext)
  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()
  // const { t } = useTranslation()
  const [firstTime, setFirstTime] = useState(true)

  useEffect(() => {
    if (firstTime && query.showTradingReward) {
      setFirstTime(false)
      setIsSwapHotTokenDisplay(true)

      if (!isSwapHotTokenDisplay && isChartDisplayed) {
        setIsChartDisplayed?.((currentIsChartDisplayed) => !currentIsChartDisplayed)
      }
    }
  }, [firstTime, isChartDisplayed, isSwapHotTokenDisplay, query, setIsSwapHotTokenDisplay, setIsChartDisplayed])

  // swap state & price data
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  const singleTokenPrice = useSingleTokenSwapInfo(
    inputCurrencyId,
    inputCurrency,
    outputCurrencyId,
    outputCurrency,
    isChartSupported,
  )

  return (
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded || true}>
      <Flex width="100%" height="100%" justifyContent="center" position="relative" alignItems="center">
        {isDesktop && isChartSupported && (
          <PriceChartContainer
            inputCurrencyId={inputCurrencyId}
            inputCurrency={currencies[Field.INPUT]}
            outputCurrencyId={outputCurrencyId}
            outputCurrency={currencies[Field.OUTPUT]}
            isChartExpanded={isChartExpanded}
            setIsChartExpanded={setIsChartExpanded}
            isChartDisplayed={isChartDisplayed}
            currentSwapPrice={singleTokenPrice}
          />
        )}
        {!isDesktop && isChartSupported && (
          <BottomDrawer
            content={
              <PriceChartContainer
                inputCurrencyId={inputCurrencyId}
                inputCurrency={currencies[Field.INPUT]}
                outputCurrencyId={outputCurrencyId}
                outputCurrency={currencies[Field.OUTPUT]}
                isChartExpanded={isChartExpanded}
                setIsChartExpanded={setIsChartExpanded}
                isChartDisplayed={isChartDisplayed}
                currentSwapPrice={singleTokenPrice}
                isFullWidthContainer
                isMobile
              />
            }
            isOpen={isChartDisplayed}
            setIsOpen={(isOpen) => setIsChartDisplayed?.(isOpen)}
          />
        )}
        <Flex flexDirection="column" width="100%" height="100%" alignItems="center">
          <StyledSwapContainer
            justifyContent="center"
            width="100%"
            style={{ height: '100%' }}
            $isChartExpanded={isChartExpanded}
          >
            <Wrapper mt={isChartExpanded ? '24px' : '0'} height="100%">
              <V4SwapForm />
            </Wrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
