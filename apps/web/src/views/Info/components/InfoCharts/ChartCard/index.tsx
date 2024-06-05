import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { TabToggle, TabToggleGroup } from 'components/TabToggle'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
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
  volumeChartData: VolumeChartEntry[] | undefined
  tvlChartData: TvlChartEntry[] | undefined
  tokenData?: TokenData
  tokenPriceData?: PriceChartEntry[]
}

const ChartCard: React.FC<React.PropsWithChildren<ChartCardProps>> = ({
  variant,
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
          time: dayjs.unix(day.date).toDate(),
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
          time: dayjs.unix(day.date).toDate(),
          value: day.volumeUSD,
        }
      })
    }
    return []
  }, [volumeChartData])

  const getLatestValueDisplay = () => {
    let valueToDisplay: string | undefined = ''
    if (hoverValue) {
      valueToDisplay = formatAmount(hoverValue)
    } else if (view === ChartView.VOLUME && formattedVolumeData.length > 0) {
      valueToDisplay = formatAmount(formattedVolumeData[formattedVolumeData.length - 1]?.value)
    } else if (view === ChartView.LIQUIDITY && formattedTvlData.length > 0) {
      valueToDisplay = formatAmount(formattedTvlData[formattedTvlData.length - 1]?.value)
    } else if ((view === ChartView.PRICE && tokenData?.priceUSD) || tokenData?.priceUSD === 0) {
      valueToDisplay = formatAmount(tokenData.priceUSD, { notation: 'standard' })
    }

    return valueToDisplay ? (
      <Text fontSize="24px" bold>
        ${valueToDisplay}
      </Text>
    ) : (
      <Skeleton height="36px" width="128px" />
    )
  }

  return (
    <Card>
      <TabToggleGroup>
        <TabToggle isActive={view === ChartView.VOLUME} onClick={() => setView(ChartView.VOLUME)}>
          <Text>{t('Volume')}</Text>
        </TabToggle>
        <TabToggle isActive={view === ChartView.LIQUIDITY} onClick={() => setView(ChartView.LIQUIDITY)}>
          <Text>{t('Liquidity')}</Text>
        </TabToggle>
        {variant === 'token' ? (
          <TabToggle isActive={view === ChartView.PRICE} onClick={() => setView(ChartView.PRICE)}>
            <Text>{t('Price')}</Text>
          </TabToggle>
        ) : (
          <></>
        )}
      </TabToggleGroup>

      <Flex flexDirection="column" px="24px" pt="24px">
        {getLatestValueDisplay()}
        <Text small color="secondary">
          {hoverDate || currentDate}
        </Text>
      </Flex>

      <Box px="24px" height={variant === 'token' ? '250px' : '335px'}>
        {view === ChartView.LIQUIDITY ? (
          <LineChart data={formattedTvlData} setHoverValue={setHoverValue} setHoverDate={setHoverDate} />
        ) : view === ChartView.VOLUME ? (
          <BarChart data={formattedVolumeData} setHoverValue={setHoverValue} setHoverDate={setHoverDate} />
        ) : view === ChartView.PRICE ? (
          <CandleChart data={tokenPriceData} setValue={setHoverValue} setLabel={setHoverDate} />
        ) : null}
      </Box>
    </Card>
  )
}

export default ChartCard
