import { Box, Flex, Text } from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import { useState } from 'react'
import { ResponsiveContainer } from 'recharts'
import { PoolInfo } from 'state/farmsV4/state/type'
import LineChart from 'views/Info/components/InfoCharts/LineChart'
import { formatDollarAmount } from 'views/V3Info/utils/numbers'
import { usePoolChartTVLData } from '../hooks/usePoolChartTVLData'

type ChartTVLProps = {
  address?: string
  poolInfo?: PoolInfo | null
}

export const ChartTVL: React.FC<ChartTVLProps> = ({ address, poolInfo }) => {
  const { data } = usePoolChartTVLData(address, poolInfo?.protocol, '1Y')
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()

  return (
    <>
      <Flex flexDirection="column">
        <Text bold fontSize={24}>
          {formatDollarAmount(hoverValue ?? data?.[data.length - 1]?.value)}
        </Text>
        <Text small color="secondary">
          {`${dayjs(hoverDate ?? data?.[data.length - 1]?.time).format('MMM D, YYYY, HH:mm A')} (UTC)`}
        </Text>
      </Flex>
      <Box height="380px">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data ?? []} setHoverDate={setHoverDate} setHoverValue={setHoverValue} dateFormat="DD" />
        </ResponsiveContainer>
      </Box>
    </>
  )
}
