import { Box, Flex, Skeleton, Text, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { useFetchPairPrices, useSingleTokenSwapInfo } from 'state/swap/hooks'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import { formatAmount, formatAmountNotation } from 'views/Info/utils/formatInfoNumbers'
import NoChartAvailable from './NoChartAvailable'
import SwapLineChart from './SwapLineChart'
import { getTimeWindowChange } from './utils'

const formatOptions = {
  notation: 'standard' as formatAmountNotation,
  displayThreshold: 0.001,
  tokenPrecision: true,
}

const BasicChart = ({ token0Address, token1Address, isChartExpanded, outputCurrency, isMobile }) => {
  const singleTokenPrice = useSingleTokenSwapInfo()
  const [timeWindow, setTimeWindow] = useState<PairDataTimeWindowEnum>(0)

  const { pairPrices = [], pairId } = useFetchPairPrices({
    token0Address,
    token1Address,
    timeWindow,
    currentSwapPrice: singleTokenPrice,
  })
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const valueToDisplay = hoverValue || pairPrices[pairPrices.length - 1]?.value
  const { changePercentage, changeValue } = getTimeWindowChange(pairPrices)
  const isChangePositive = changeValue >= 0
  const chartHeight = isChartExpanded ? 'calc(100% - 120px)' : '310px'
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const currentDate = new Date().toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Sometimes we might receive array full of zeros for obscure tokens while trying to derive data
  // In that case chart is not useful to users
  const isBadData =
    pairPrices &&
    pairPrices.length > 0 &&
    pairPrices.every(
      (price) => !price.value || price.value === 0 || price.value === Infinity || Number.isNaN(price.value),
    )

  if (isBadData) {
    return (
      <NoChartAvailable
        token0Address={token0Address}
        token1Address={token1Address}
        pairAddress={pairId}
        isMobile={isMobile}
      />
    )
  }

  return (
    <>
      <Flex
        flexDirection={['column', null, null, null, null, null, 'row']}
        alignItems={['flex-start', null, null, null, null, null, 'center']}
        justifyContent="space-between"
        px="24px"
      >
        <Flex flexDirection="column" pt="12px">
          {pairPrices?.length > 0 && valueToDisplay ? (
            <Flex alignItems="flex-end">
              <Text fontSize="40px" mr="8px" bold>
                {formatAmount(valueToDisplay, formatOptions)}
              </Text>
              <Text color="textSubtle" fontSize="20px" mb="8px" mr="8px" bold>
                {outputCurrency?.symbol}
              </Text>
              <Text color={isChangePositive ? 'success' : 'failure'} fontSize="20px" mb="8px" bold>
                {`${isChangePositive ? '+' : ''}${changeValue.toFixed(3)} (${changePercentage}%)`}
              </Text>
            </Flex>
          ) : (
            <Skeleton height="36px" width="128px" />
          )}
          <Text small color="secondary">
            {hoverDate || currentDate}
          </Text>
        </Flex>
        <Box>
          <ButtonMenu activeIndex={timeWindow} onItemClick={setTimeWindow} scale="sm">
            <ButtonMenuItem>{t('24H')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1W')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1M')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1Y')}</ButtonMenuItem>
          </ButtonMenu>
        </Box>
      </Flex>
      <Box height={isMobile ? '100%' : chartHeight} p={isMobile ? '0px' : '16px'} width="100%">
        <SwapLineChart
          data={pairPrices}
          setHoverValue={setHoverValue}
          setHoverDate={setHoverDate}
          isChangePositive={isChangePositive}
          timeWindow={timeWindow}
        />
      </Box>
    </>
  )
}

export default BasicChart
