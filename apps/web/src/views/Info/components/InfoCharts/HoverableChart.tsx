import { Box, Skeleton, Text } from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import { memo, useEffect, useMemo, useState } from 'react'
import { ProtocolData, TvlChartEntry, VolumeChartEntry } from 'state/info/types'
import { formatAmount } from 'utils/formatInfoNumbers'
import BarChart from './BarChart'
import LineChart from './LineChart'

interface HoverableChartProps {
  volumeChartData: VolumeChartEntry[] | undefined
  tvlChartData: TvlChartEntry[] | undefined
  protocolData: ProtocolData | undefined
  currentDate: string
  valueProperty: string
  title: string
  ChartComponent: typeof BarChart | typeof LineChart
}

const HoverableChart = ({
  volumeChartData,
  tvlChartData,
  protocolData,
  currentDate,
  valueProperty,
  title,
  ChartComponent,
}: HoverableChartProps) => {
  const [hover, setHover] = useState<number | undefined>()
  const [dateHover, setDateHover] = useState<string | undefined>()

  // Getting latest data to display on top of chart when not hovered
  useEffect(() => {
    setHover(undefined)
  }, [protocolData])

  useEffect(() => {
    if (typeof hover === 'undefined' && protocolData) {
      setHover(protocolData[valueProperty])
    }
  }, [protocolData, hover, valueProperty])

  const formattedData = useMemo(() => {
    const data = valueProperty === 'volumeUSD' ? volumeChartData : tvlChartData
    if (data) {
      return data.map((day) => {
        return {
          time: dayjs.unix(day.date).toDate(),
          value: day[valueProperty],
        }
      })
    }
    return []
  }, [tvlChartData, valueProperty, volumeChartData])

  return (
    <Box p={['16px', '16px', '24px']}>
      <Text bold color="secondary">
        {title}
      </Text>
      {Number(hover) > -1 ? ( // sometimes data is 0
        <Text bold fontSize="24px">
          ${formatAmount(hover)}
        </Text>
      ) : (
        <Skeleton width="128px" height="36px" />
      )}
      <Text>{dateHover ?? currentDate}</Text>
      <Box height="250px">
        <ChartComponent data={formattedData} setHoverValue={setHover} setHoverDate={setDateHover} />
      </Box>
    </Box>
  )
}

export default memo(HoverableChart)
