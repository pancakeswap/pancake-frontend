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
import React, { useState } from 'react'
import { format } from 'date-fns'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { formatAmount, formatAmoutNotation } from 'views/Info/utils/formatInfoNumbers'
import { useTranslation } from 'contexts/Localization'
import SwapLineChart from './SwapLineChart'
import { StyledExpandButton, StyledPriceChart, StyledSwapButton } from './styles'
import { getTimewindowChange } from './utils'

const formatOptions = {
  notation: 'standard' as formatAmoutNotation,
  displayThreshold: 0.001,
  tokenPrecision: true,
}

const PriceChart = ({
  lineChartData = [],
  setTimeWindow,
  timeWindow,
  inputCurrency,
  outputCurrency,
  onSwitchTokens,
  isDark,
  isChartExpanded,
  setIsChartExpanded,
}) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const currentDate = format(new Date(), 'HH:mm dd MMM, yyyy')
  const valueToDisplay = hoverValue || lineChartData[lineChartData.length - 1]?.value
  const { changePercentage, changeValue } = getTimewindowChange(lineChartData)
  const isChangePositive = changeValue >= 0
  const { t } = useTranslation()

  const toggleExpanded = () => setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)

  return (
    <StyledPriceChart $isDark={isDark} $isExpanded={isChartExpanded} p="24px">
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
        {setIsChartExpanded && (
          <Flex>
            <StyledExpandButton type="button" onClick={toggleExpanded}>
              {isChartExpanded ? <ArrowUpIcon color="text" /> : <ArrowDownIcon color="text" />}
            </StyledExpandButton>
          </Flex>
        )}
      </Flex>
      <Flex
        flexDirection={['column', null, null, null, 'row']}
        alignItems={['flex-start', null, null, null, 'center']}
        justifyContent="space-between"
      >
        <Flex flexDirection="column" pt="12px">
          {lineChartData?.length > 0 && valueToDisplay ? (
            <Flex alignItems="flex-end">
              <Text fontSize="40px" mr="8px" bold>
                {formatAmount(valueToDisplay, formatOptions)}
              </Text>
              <Text color="textSubtle" fontSize="20px" mb="8px" mr="8px" bold>
                {outputCurrency?.symbol}
              </Text>
              <Text color={isChangePositive ? 'success' : 'failure'} fontSize="20px" mb="8px" bold>
                {`${isChangePositive ? '+' : ''}${formatAmount(changeValue, formatOptions)} (${changePercentage}%)`}
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
            <ButtonMenuItem>{t('24H')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1W')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1M')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1Y')}</ButtonMenuItem>
            <ButtonMenuItem>{t('All time')}</ButtonMenuItem>
          </ButtonMenu>
        </Box>
      </Flex>
      <Box height={isChartExpanded ? 'calc(100% - 120px)' : '516px'} width="100%">
        <SwapLineChart
          data={lineChartData}
          setHoverValue={setHoverValue}
          setHoverDate={setHoverDate}
          isChangePositive={isChangePositive}
          timeWindow={timeWindow}
        />
      </Box>
    </StyledPriceChart>
  )
}

export default PriceChart
