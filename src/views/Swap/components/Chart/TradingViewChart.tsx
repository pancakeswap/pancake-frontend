import { Currency } from '@pancakeswap/sdk'
import { Box, Flex } from '@pancakeswap/uikit'
import TradingView from 'components/TradingView'
import React from 'react'
import { useSingleTokenSwapInfo } from 'state/swap/hooks'
import TokenDisplay from './TokenDisplay'

interface TradingViewChartProps {
  isChartExpanded: boolean
  inputCurrency: Currency
  outputCurrency: Currency
  token1Address: string
  isMobile: boolean
}

const TradingViewChart = ({
  isChartExpanded,
  outputCurrency,
  inputCurrency,
  token1Address,
  isMobile,
}: TradingViewChartProps) => {
  const tokens = useSingleTokenSwapInfo()

  const token1Price = tokens?.[token1Address]

  return (
    <>
      <Flex
        flexDirection={['column', null, null, null, null, null, 'row']}
        alignItems={['flex-start', null, null, null, null, null, 'center']}
        justifyContent="space-between"
        height={isMobile ? '100%' : isChartExpanded ? 'calc(100% - 120px)' : '430px'}
      >
        <Flex flexDirection="column" pt="12px" position="relative" height="100%" width="100%">
          <TokenDisplay value={token1Price} symbol={outputCurrency?.symbol} px="24px" />
          <Box height="100%" pt="4px">
            {inputCurrency?.symbol && outputCurrency?.symbol && (
              <TradingView id="tv_chart" symbol={`PANCAKESWAP:${inputCurrency.symbol}${outputCurrency.symbol}`} />
            )}
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default TradingViewChart
