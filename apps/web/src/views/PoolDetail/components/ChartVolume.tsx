import { Flex, Text } from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import { useState } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import styled from 'styled-components'
import BarChart from 'views/V3Info/components/BarChart/alt'
import { formatDollarAmount } from 'views/V3Info/utils/numbers'
import { usePoolChartVolumeData } from '../hooks/usePoolChartVolumeData'

const StyledBarChart = styled(BarChart)`
  padding: 0 !important;
`

type ChartVolumeProps = {
  address?: string
  poolInfo?: PoolInfo | null
}

export const ChartVolume: React.FC<ChartVolumeProps> = ({ address, poolInfo }) => {
  const { data } = usePoolChartVolumeData(address, poolInfo?.protocol, '1Y')
  const [latestValue, setLatestValue] = useState<number | undefined>()
  const [valueLabel, setValueLabel] = useState<string | undefined>()

  return (
    <>
      <Flex flexDirection="column">
        <Text bold fontSize={24}>
          {formatDollarAmount(latestValue ?? data?.[data.length - 1]?.value)}
        </Text>
        <Text small color="secondary">
          {`${dayjs(valueLabel ?? data?.[data.length - 1]?.time).format('MMM D, YYYY')} (UTC)`}
        </Text>
      </Flex>
      <StyledBarChart
        p="0 !important"
        data={data!}
        minHeight={340}
        setValue={setLatestValue}
        setLabel={setValueLabel}
        value={latestValue}
        label={valueLabel}
        barGap={6}
        chartMargin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      />
    </>
  )
}
