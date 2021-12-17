import { Currency } from '@pancakeswap/sdk'
import { Box, BunnyPlaceholderIcon, Flex, Text } from '@pancakeswap/uikit'
import TradingView, { TradingViewLabel, useTradingViewEvent } from 'components/TradingView'
import { useTranslation } from 'contexts/Localization'
import useDebounce from 'hooks/useDebounce'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { BarChartLoader } from 'views/Info/components/ChartLoaders'
import TokenDisplay from './TokenDisplay'

interface TradingViewChartProps {
  isChartExpanded: boolean
  inputCurrency: Currency
  outputCurrency: Currency
  token0Address: string
  isMobile: boolean
  isDark: boolean
  currentSwapPrice: {
    [key: string]: number
  }
}

const TradingViewWrapper = styled.div<{ $show: boolean }>`
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.2s ease-in;
  height: 100%;
`

const LoadingWrapper = styled.div<{ $isDark: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: ${({ theme }) => theme.colors.backgroundAlt};

  ${({ theme }) => theme.mediaQueries.md} {
    background: ${({ $isDark }) => ($isDark ? '#2E2E42' : '#F4FCFF')};
  }
`

const bnbToWBNBSymbol = (sym: string) => (sym === 'BNB' ? 'WBNB' : sym)

const ID = 'TV_SWAP_CHART'
const SYMBOL_PREFIX = 'PANCAKESWAP:'

const TradingViewChart = ({
  isChartExpanded,
  outputCurrency,
  inputCurrency,
  token0Address,
  isMobile,
  isDark,
  currentSwapPrice,
}: TradingViewChartProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()
  const token0Price = currentSwapPrice?.[token0Address]

  const [hasNoData, setHasNoData] = useState(false)

  const symbol = useMemo(() => {
    if (!(inputCurrency?.symbol && outputCurrency?.symbol)) {
      return null
    }

    const input = bnbToWBNBSymbol(inputCurrency.symbol)
    const output = bnbToWBNBSymbol(outputCurrency.symbol)
    return `${input}${output}`
  }, [inputCurrency?.symbol, outputCurrency?.symbol])

  const onNoDataEvent = useCallback(() => {
    console.debug('No data from TV widget')
    setHasNoData(true)
  }, [])

  const onLoadedEvent = useCallback(() => {
    setIsLoading(false)
  }, [])

  useTradingViewEvent({
    id: ID,
    onNoDataEvent,
    onLoadedEvent,
  })

  // debounce the loading to wait for no data event from TV widget.
  // we cover the loading spinner over TV, let TV try to load data from pairs
  // if there's no no-data event coming between the debounce time, we assume the chart is loaded
  const debouncedLoading = useDebounce(isLoading, 800)

  return (
    <>
      <Flex
        flexDirection={['column', null, null, null, null, null, 'row']}
        alignItems={['flex-start', null, null, null, null, null, 'center']}
        justifyContent="space-between"
        height={isMobile ? '100%' : isChartExpanded ? 'calc(100% - 48px)' : '430px'}
      >
        <Flex flexDirection="column" pt="12px" position="relative" height="100%" width="100%">
          <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
            <TokenDisplay
              value={token0Price}
              inputSymbol={inputCurrency?.symbol}
              outputSymbol={outputCurrency?.symbol}
              mx="24px"
            />
            {!(isLoading || debouncedLoading) && !hasNoData && symbol && <TradingViewLabel symbol={symbol} />}
          </Flex>
          <Box height="100%" pt="4px" position="relative">
            {hasNoData && (
              <Flex height="100%" justifyContent="center" alignItems="center" flexDirection="column">
                <BunnyPlaceholderIcon width="96px" height="96px" />
                <Text bold fontSize="20px" color="textDisabled" mt="16px">
                  {t('TradingView chart not available')}
                </Text>
              </Flex>
            )}
            {(isLoading || debouncedLoading) && !hasNoData && (
              <LoadingWrapper $isDark={isDark}>
                <BarChartLoader />
              </LoadingWrapper>
            )}
            {!hasNoData && (
              <TradingViewWrapper $show={!isLoading}>
                {symbol && <TradingView id={ID} symbol={`${SYMBOL_PREFIX}${symbol}`} />}
              </TradingViewWrapper>
            )}
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default TradingViewChart
