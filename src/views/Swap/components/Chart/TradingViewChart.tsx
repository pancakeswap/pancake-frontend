import { Currency } from '@pancakeswap/sdk'
import { Box, Flex } from '@pancakeswap/uikit'
import TradingView, { useTradingViewEvent } from 'components/TradingView'
import useDebounce from 'hooks/useDebounce'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { BarChartLoader } from 'views/Info/components/ChartLoaders'
import TokenDisplay from './TokenDisplay'

interface TradingViewChartProps {
  isChartExpanded: boolean
  inputCurrency: Currency
  outputCurrency: Currency
  token1Address: string
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
  background: ${({ $isDark }) => ($isDark ? '#2E2E42' : '#F4FCFF')};
`

const bnbToWBNBSymbol = (sym: string) => (sym === 'BNB' ? 'WBNB' : sym)

const ID = 'TV_SWAP_CHART'

const TradingViewChart = ({
  isChartExpanded,
  outputCurrency,
  inputCurrency,
  token1Address,
  isMobile,
  isDark,
  currentSwapPrice,
}: TradingViewChartProps) => {
  const [isLoading, setIsLoading] = useState(true)

  const token1Price = currentSwapPrice?.[token1Address]

  // try inverted pairs when no data in widget
  const [isInverted, setIsInverted] = useState(false)

  const symbol = useMemo(() => {
    if (!(inputCurrency?.symbol && outputCurrency?.symbol)) {
      return null
    }
    const prefix = 'PANCAKESWAP:'
    const input = bnbToWBNBSymbol(inputCurrency.symbol)
    const output = bnbToWBNBSymbol(outputCurrency.symbol)
    if (isInverted) {
      return `${prefix}${output}${input}`
    }
    return `${prefix}${input}${output}`
  }, [inputCurrency?.symbol, outputCurrency?.symbol, isInverted])

  const onNoDataEvent = useCallback(() => {
    console.debug('No data from TV widget')
    if (!isInverted) {
      setIsLoading(true)
    }
    setIsInverted(true)
  }, [isInverted])

  const onLoadedEvent = useCallback(() => {
    setIsLoading(false)
  }, [])

  useTradingViewEvent({
    id: ID,
    onNoDataEvent,
    onLoadedEvent,
  })

  // reset state if input or output symbol changed
  useEffect(() => {
    setIsInverted(false)
    setIsLoading(true)
  }, [inputCurrency?.symbol, outputCurrency?.symbol])

  // debounce the loading to wait for no data event from TV widget.
  // we cover the loading spinner over TV, let TV try to load data from pairs or inverted pairs fallback
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
          <TokenDisplay value={token1Price} symbol={outputCurrency?.symbol} mx="24px" />
          <Box height="100%" pt="4px" position="relative">
            {(isLoading || debouncedLoading) && (
              <LoadingWrapper $isDark={isDark}>
                <BarChartLoader />
              </LoadingWrapper>
            )}
            <TradingViewWrapper $show={!isLoading}>
              {symbol && <TradingView id={ID} symbol={symbol} />}
            </TradingViewWrapper>
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default TradingViewChart
