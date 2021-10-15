import {
  ArrowDownIcon,
  ArrowUpIcon,
  Box,
  ButtonMenu,
  ButtonMenuItem,
  Flex,
  Skeleton,
  SyncAltIcon,
  Text,
} from '@pancakeswap/uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { format } from 'date-fns'
import React, { useState } from 'react'
import SwapLineChart from './SwapLineChart'
import { StyledExpandButton, StyledPriceChart, StyledSwapButton } from './styles'

const PriceChart = ({
  lineChartData = [],
  setTimeWindow,
  timeWindow,
  inputCurrency,
  outputCurrency,
  onSwitchTokens,
  isDark,
  isPairReversed,
  isChartExpanded,
  setIsChartExpanded,
}) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const currentDate = format(new Date(), 'MMM d, yyyy')
  const valueToDisplay = hoverValue

  const toggleExpanded = () => setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)

  return (
    <StyledPriceChart $isDark={isDark} $isExpanded={isChartExpanded} p="24px" mr="40px">
      <Flex justifyContent="space-between">
        <Flex alignItems="center">
          {outputCurrency ? (
            <DoubleCurrencyLogo currency0={inputCurrency} currency1={outputCurrency} size={24} margin />
          ) : (
            inputCurrency && <CurrencyLogo currency={inputCurrency} size="24px" style={{ marginRight: '8px' }} />
          )}
          {inputCurrency && (
            <Text color="text" bold>
              {outputCurrency ? `${inputCurrency.symbol}/${outputCurrency.symbol}` : inputCurrency.symbol}
            </Text>
          )}
          <StyledSwapButton type="button" onClick={onSwitchTokens}>
            <SyncAltIcon ml="6px" color="primary" />
          </StyledSwapButton>
        </Flex>
        <Flex>
          <StyledExpandButton type="button" onClick={toggleExpanded}>
            {isChartExpanded ? <ArrowUpIcon color="text" /> : <ArrowDownIcon color="text" />}
          </StyledExpandButton>
        </Flex>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column" pt="12px">
          {valueToDisplay ? (
            <Flex alignItems="flex-end">
              <Text fontSize="40px" mr="8px" bold>
                {valueToDisplay}
              </Text>
              <Text color="textSubtle" fontSize="20px" mb="8px" bold>
                {outputCurrency?.symbol}
              </Text>
            </Flex>
          ) : (
            <Skeleton height="36px" width="128px" />
          )}
          <Text small color="secondary">
            {hoverDate || currentDate}
          </Text>
        </Flex>
        <Box mr="40px">
          <ButtonMenu activeIndex={timeWindow} onItemClick={setTimeWindow} scale="sm">
            <ButtonMenuItem>24H</ButtonMenuItem>
            <ButtonMenuItem>1W</ButtonMenuItem>
            <ButtonMenuItem>1M</ButtonMenuItem>
            <ButtonMenuItem>1Y</ButtonMenuItem>
            <ButtonMenuItem>All time</ButtonMenuItem>
          </ButtonMenu>
        </Box>
      </Flex>
      <Box height={isChartExpanded ? 'calc(100% - 120px)' : '516px'} width="100%">
        <SwapLineChart
          data={lineChartData}
          setHoverValue={setHoverValue}
          setHoverDate={setHoverDate}
          isPairReversed={isPairReversed}
          timeWindow={timeWindow}
        />
      </Box>
    </StyledPriceChart>
  )
}

export default PriceChart
