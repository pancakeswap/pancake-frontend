import { Currency } from '@pancakeswap/sdk'
import { BottomDrawer, Flex, Text, StyledLink, useMatchBreakpoints, AutoRow } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { useCurrency } from 'hooks/Tokens'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useSingleTokenSwapInfo, useSwapState } from 'state/swap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import Link from 'next/link'
import Page from '../../Page'
import PriceChartContainer from '../components/Chart/PriceChartContainer'
import { SwapSelection } from '../components/SwapSelection'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from '../styles'
import { SwapFeaturesContext } from '../SwapFeaturesContext'
import { SwapType } from '../types'
import { OrderHistory, TWAPPanel } from './Twap'

export default function TwapAndLimitSwap({ limit }: { limit?: boolean }) {
  const { query } = useRouter()
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { isChartExpanded, isChartDisplayed, setIsChartDisplayed, setIsChartExpanded, isChartSupported } =
    useContext(SwapFeaturesContext)
  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()
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
  useDefaultsFromURLSearch()

  return (
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded}>
      <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
        {isDesktop && (
          <Flex width={isChartExpanded ? '100%' : '50%'} maxWidth="928px" flexDirection="column" style={{ gap: 20 }}>
            {isChartSupported && (
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
              />
            )}
            <OrderHistory />
          </Flex>
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
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <SwapSelection swapType={limit ? SwapType.LIMIT : SwapType.TWAP} />
              <AppBody>
                <TWAPPanel limit={limit} />
              </AppBody>
              <Flex flexDirection={!isDesktop ? 'column-reverse' : 'column'}>
                {limit && (
                  <AutoRow gap="4px" justifyContent="center">
                    <Text fontSize="14px" color="textSubtle">
                      {t('Orders missing? Check out:')}
                    </Text>
                    <Link href="/limit-orders" passHref prefetch={false}>
                      <StyledLink fontSize="14px" color="primary">
                        {t('Limit V2 (deprecated)')}
                      </StyledLink>
                    </Link>
                  </AutoRow>
                )}
                {!isDesktop && <OrderHistory />}
              </Flex>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
