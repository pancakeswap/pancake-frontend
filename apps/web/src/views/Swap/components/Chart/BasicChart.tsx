import { Box, ButtonMenu, ButtonMenuItem, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useState, memo, useMemo } from 'react'
import { useFetchPairPricesV3 } from 'state/swap/hooks'
import dynamic from 'next/dynamic'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import NoChartAvailable from './NoChartAvailable'
import PairPriceDisplay from '../../../../components/PairPriceDisplay'
import { getTimeWindowChange } from './utils'

const SwapLineChart = dynamic(() => import('@pancakeswap/uikit/src/components/Chart/PairPriceChart'), {
  ssr: false,
})

const BasicChart = ({
  token0Address,
  token1Address,
  isChartExpanded,
  inputCurrency,
  outputCurrency,
  isMobile,
  currentSwapPrice,
}) => {
  const [timeWindow, setTimeWindow] = useState<PairDataTimeWindowEnum>(0)

  const { data: pairPrices = [] } = useFetchPairPricesV3({
    token0Address,
    token1Address,
    timeWindow,
    currentSwapPrice,
  })

  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const valueToDisplay = hoverValue || pairPrices[pairPrices.length - 1]?.value
  const {
    changePercentage: changePercentageToCurrent,
    changeValue: changeValueToCurrent,
    isChangePositive: isChangePositiveToCurrent,
  } = useMemo(() => getTimeWindowChange(pairPrices), [pairPrices])
  const { changePercentage, changeValue, isChangePositive } = useMemo(() => {
    if (hoverValue) {
      const lastItem = pairPrices[pairPrices.length - 1]
      if (lastItem) {
        const copyPairPrices = [...pairPrices]
        copyPairPrices[pairPrices.length - 1] = { ...lastItem, value: hoverValue }
        return getTimeWindowChange(copyPairPrices)
      }
    }
    return {
      changePercentage: changePercentageToCurrent,
      changeValue: changeValueToCurrent,
      isChangePositive: isChangePositiveToCurrent,
    }
  }, [pairPrices, hoverValue, changePercentageToCurrent, changeValueToCurrent, isChangePositiveToCurrent])
  const chartHeight = useMemo(() => (isChartExpanded ? 'calc(100vh - 220px)' : '320px'), [isChartExpanded])
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const currentDate = useMemo(() => {
    if (!hoverDate) {
      return new Date().toLocaleString(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    return null
  }, [hoverDate, locale])

  // Sometimes we might receive array full of zeros for obscure tokens while trying to derive data
  // In that case chart is not useful to users
  const isBadData = useMemo(
    () =>
      pairPrices &&
      pairPrices.length > 0 &&
      pairPrices.every(
        (price) => !price.value || price.value === 0 || price.value === Infinity || Number.isNaN(price.value),
      ),
    [pairPrices],
  )

  if (isBadData) {
    return <NoChartAvailable token0Address={token0Address} token1Address={token1Address} isMobile={isMobile} />
  }

  return (
    <>
      <Flex
        flexDirection={['column', null, null, null, null, null, 'row']}
        alignItems={['flex-start', null, null, null, null, null, 'center']}
        justifyContent="space-between"
        px="24px"
        flexWrap="wrap"
      >
        <Flex flexDirection="column" pt="12px">
          <PairPriceDisplay
            value={pairPrices?.length > 0 && valueToDisplay}
            inputSymbol={inputCurrency?.symbol}
            outputSymbol={outputCurrency?.symbol}
          >
            <Text color={isChangePositive ? 'success' : 'failure'} fontSize="20px" ml="4px" bold>
              {`${isChangePositive ? '+' : ''}${changeValue.toFixed(3)} (${changePercentage}%)`}
            </Text>
          </PairPriceDisplay>
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
          isChangePositive={isChangePositiveToCurrent}
          isChartExpanded={isChartExpanded}
          timeWindow={timeWindow}
        />
      </Box>
    </>
  )
}

export default memo(BasicChart, (prev, next) => {
  return (
    prev.token0Address === next.token0Address &&
    prev.token1Address === next.token1Address &&
    prev.isChartExpanded === next.isChartExpanded &&
    prev.isMobile === next.isMobile &&
    prev.isChartExpanded === next.isChartExpanded &&
    ((prev.currentSwapPrice !== null &&
      next.currentSwapPrice !== null &&
      prev.currentSwapPrice[prev.token0Address] === next.currentSwapPrice[next.token0Address] &&
      prev.currentSwapPrice[prev.token1Address] === next.currentSwapPrice[next.token1Address]) ||
      (prev.currentSwapPrice === null && next.currentSwapPrice === null))
  )
})
