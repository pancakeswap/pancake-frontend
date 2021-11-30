import { Currency } from '@pancakeswap/sdk'
import { Box, Flex } from '@pancakeswap/uikit'
import TradingView, { useTradingViewNoDataEvent } from 'components/TradingView'
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { useSingleTokenSwapInfo } from 'state/swap/hooks'
import TokenDisplay from './TokenDisplay'

interface TradingViewChartProps {
  isChartExpanded: boolean
  inputCurrency: Currency
  outputCurrency: Currency
  token1Address: string
  isMobile: boolean
}

const bnbToWBNBSymbol = (sym: string) => (sym === 'BNB' ? 'WBNB' : sym)

const ID = 'TV_SWAP_CHART'

const TradingViewChart = ({
  isChartExpanded,
  outputCurrency,
  inputCurrency,
  token1Address,
  isMobile,
}: TradingViewChartProps) => {
  const tokens = useSingleTokenSwapInfo()

  const token1Price = tokens?.[token1Address]

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
    setIsInverted(true)
  }, [])

  useTradingViewNoDataEvent({
    id: ID,
    onNoDataEvent,
  })

  // reset state if input or output symbol changed
  useEffect(() => {
    setIsInverted(false)
  }, [inputCurrency?.symbol, outputCurrency?.symbol])

  return (
    <>
      <Flex
        flexDirection={['column', null, null, null, null, null, 'row']}
        alignItems={['flex-start', null, null, null, null, null, 'center']}
        justifyContent="space-between"
        height={isMobile ? '100%' : isChartExpanded ? 'calc(100% - 120px)' : '430px'}
      >
        <Flex flexDirection="column" pt="12px" position="relative" height="100%" width="100%">
          <TokenDisplay value={token1Price} symbol={outputCurrency?.symbol} mx="24px" />
          <Box height="100%" pt="4px">
            {symbol && <TradingView id={ID} symbol={symbol} />}
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default TradingViewChart
