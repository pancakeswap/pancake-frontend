import { Box, ButtonMenu, ButtonMenuItem, Flex, Skeleton, SyncAltIcon, Text } from '@pancakeswap/uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { format } from 'date-fns'
import React, { useState } from 'react'
import LineChart from 'views/Info/components/InfoCharts/LineChart'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import { StyledPriceChart, StyledSwapButton } from './styles/priceChartStyles'

const PriceChart = ({
  lineChartData = [],
  setTimeWindowIndex,
  timeWindowIndex,
  inputCurrency,
  outputCurrency,
  onSwitchTokens,
  isDark,
}) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const currentDate = format(new Date(), 'MMM d, yyyy')
  const valueToDisplay = formatAmount(hoverValue)

  return (
    <StyledPriceChart $isDark={isDark} p="24px" mr="40px">
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
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column" pt="12px">
          {valueToDisplay ? (
            <Flex alignItems="flex-end">
              <Text fontSize="40px" mr="8px" bold>
                {valueToDisplay}
              </Text>
              <Text color="textSubtle" fontSize="20px" mb="8px" bold>
                {inputCurrency?.symbol}
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
          <ButtonMenu activeIndex={timeWindowIndex} onItemClick={setTimeWindowIndex} scale="sm">
            <ButtonMenuItem>24H</ButtonMenuItem>
            <ButtonMenuItem>1W</ButtonMenuItem>
            <ButtonMenuItem>1M</ButtonMenuItem>
            <ButtonMenuItem>1Y</ButtonMenuItem>
          </ButtonMenu>
        </Box>
      </Flex>
      <Box height="335px" minWidth="752px">
        <LineChart data={lineChartData} setHoverValue={setHoverValue} setHoverDate={setHoverDate} />
      </Box>
    </StyledPriceChart>
  )
}

export default PriceChart
