import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  ButtonMenu,
  ButtonMenuItem,
  Card,
  Flex,
  ChartDataTimeWindowEnum,
  Skeleton,
  Text,
} from '@pancakeswap/uikit'
import { TabToggle, TabToggleGroup } from 'components/TabToggle'
import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from 'react'
import { PriceChartEntry, TokenData, TvlChartEntry, VolumeChartEntry } from 'state/info/types'
import { formatAmount } from 'utils/formatInfoNumbers'
import BarChart from 'views/Info/components/InfoCharts/BarChart'
import LineChart from 'views/Info/components/InfoCharts/LineChart'

const CandleChart = dynamic(() => import('../CandleChart'), {
  ssr: false,
})

enum ChartView {
  LIQUIDITY,
  VOLUME,
  PRICE,
}

interface ChartCardProps {
  variant: 'pool' | 'token'
  timeWindow: ChartDataTimeWindowEnum
  setTimeWindow: (timeWindow: ChartDataTimeWindowEnum) => void
  volumeChartData: VolumeChartEntry[] | undefined
  tvlChartData: TvlChartEntry[] | undefined
  tokenData?: TokenData
  tokenPriceData?: PriceChartEntry[]
}

const ChartCard: React.FC<React.PropsWithChildren<ChartCardProps>> = ({
  variant,
  timeWindow,
  setTimeWindow,
  volumeChartData,
  tvlChartData,
  tokenData,
  tokenPriceData,
}) => {
  const [view, setView] = useState(ChartView.VOLUME)
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const currentDate = new Date().toLocaleString(locale, { month: 'short', year: 'numeric', day: 'numeric' })

  const formattedTvlData = useMemo(() => {
    if (tvlChartData) {
      return tvlChartData.map((day) => {
        return {
          time: day.date,
          value: day.liquidityUSD,
        }
      })
    }
    return []
  }, [tvlChartData])
  const formattedVolumeData = useMemo(() => {
    if (volumeChartData) {
      return volumeChartData.map((day) => {
        return {
          time: day.date,
          value: day.volumeUSD,
        }
      })
    }
    return []
  }, [volumeChartData])

  const valueToDisplay = useMemo(() => {
    if (hoverValue) {
      return formatAmount(hoverValue)
    }
    if (view === ChartView.VOLUME && formattedVolumeData.length > 0) {
      return formatAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
    }
    if (view === ChartView.LIQUIDITY && formattedTvlData.length > 0) {
      return formatAmount(formattedTvlData[formattedTvlData.length - 1]?.value)
    }
    if ((view === ChartView.PRICE && tokenData?.priceUSD) || tokenData?.priceUSD === 0) {
      return formatAmount(tokenData.priceUSD, { notation: 'standard' })
    }
    return undefined
  }, [hoverValue, view, formattedVolumeData, formattedTvlData, tokenData])

  const handleVolumeClick = useCallback(() => {
    setView(ChartView.VOLUME)
  }, [setView])

  const handleLiquidityClick = useCallback(() => {
    setView(ChartView.LIQUIDITY)
  }, [setView])

  const handlePriceClick = useCallback(() => {
    setView(ChartView.PRICE)
  }, [setView])

  return (
    <Card>
      <TabToggleGroup>
        <TabToggle isActive={view === ChartView.VOLUME} onClick={handleVolumeClick}>
          <Text>{t('Volume')}</Text>
        </TabToggle>
        <TabToggle isActive={view === ChartView.LIQUIDITY} onClick={handleLiquidityClick}>
          <Text>{t('Liquidity')}</Text>
        </TabToggle>
        {variant === 'token' ? (
          <TabToggle isActive={view === ChartView.PRICE} onClick={handlePriceClick}>
            <Text>{t('Price')}</Text>
          </TabToggle>
        ) : (
          <></>
        )}
      </TabToggleGroup>

      <Flex justifyContent="space-between" px="24px" pt="24px">
        <Flex flexDirection="column">
          {valueToDisplay ? (
            <Text fontSize="24px" bold>
              ${valueToDisplay}
            </Text>
          ) : (
            <Skeleton height="36px" width="128px" />
          )}
          <Text small color="secondary">
            {hoverDate || currentDate}
          </Text>
        </Flex>
        <Flex alignItems="center">
          <ButtonMenu activeIndex={timeWindow} onItemClick={setTimeWindow} scale="sm">
            <ButtonMenuItem>{t('1H')}</ButtonMenuItem>
            <ButtonMenuItem>{t('24H')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1W')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1M')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1Y')}</ButtonMenuItem>
          </ButtonMenu>
        </Flex>
      </Flex>

      <Box px="24px" height={variant === 'token' ? '250px' : '335px'}>
        {view === ChartView.LIQUIDITY ? (
          <LineChart
            data={formattedTvlData}
            timeWindow={timeWindow}
            setHoverValue={setHoverValue}
            setHoverDate={setHoverDate}
          />
        ) : view === ChartView.VOLUME ? (
          <BarChart
            data={formattedVolumeData}
            timeWindow={timeWindow}
            setHoverValue={setHoverValue}
            setHoverDate={setHoverDate}
          />
        ) : view === ChartView.PRICE ? (
          <CandleChart data={tokenPriceData} timeWindow={timeWindow} setValue={setHoverValue} setLabel={setHoverDate} />
        ) : null}
      </Box>
    </Card>
  )
}

export default ChartCard
