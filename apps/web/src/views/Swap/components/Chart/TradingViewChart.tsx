import { Box, BunnyPlaceholderIcon, Flex, Text } from '@pancakeswap/uikit'
import TradingView, { useTradingViewEvent } from 'components/TradingView'
import { useTranslation } from '@pancakeswap/localization'
import { useDebounce } from '@pancakeswap/hooks'
import { useCallback, useEffect, useMemo, useState, memo } from 'react'
import styled from 'styled-components'
import { BarChartLoader } from 'components/ChartLoaders'

interface TradingViewChartProps {
  outputSymbol: string
  inputSymbol: string
  isDark: boolean
  onTwChartSymbol?: (symbol: string) => void
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

const TradingViewChart = ({ outputSymbol, inputSymbol, isDark, onTwChartSymbol }: TradingViewChartProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation()

  const [hasNoData, setHasNoData] = useState(false)

  const symbol = useMemo(() => {
    if (!(inputSymbol && outputSymbol)) {
      return null
    }

    const input = bnbToWBNBSymbol(inputSymbol)
    const output = bnbToWBNBSymbol(outputSymbol)
    return `${input}${output}`
  }, [inputSymbol, outputSymbol])

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

  useEffect(() => {
    if (!(isLoading || debouncedLoading) && !hasNoData && symbol) {
      onTwChartSymbol(symbol)
    } else {
      onTwChartSymbol('')
    }
  }, [debouncedLoading, hasNoData, isLoading, onTwChartSymbol, symbol])

  return (
    <Box height="100%" width="100%" pt="4px" position="relative">
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
  )
}

export default memo(TradingViewChart)
