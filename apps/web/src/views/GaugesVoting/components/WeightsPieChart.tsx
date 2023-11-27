import { Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import type { ChartData, ChartDataset, TooltipModel } from 'chart.js'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import styled, { keyframes } from 'styled-components'
import { GaugeVoting } from '../hooks/useGaugesVoting'
import { ChartLabel } from './ChartLabel'
import { ChartTooltip } from './ChartTooltip'

ChartJS.register(ArcElement, Tooltip, Legend)

const Container = styled(Box)`
  position: relative;
  margin-top: 0.5em;
`

const Center = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const Absolute = styled(Box)`
  position: absolute;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
  z-index: 1;
`

const opacityAnimation = keyframes`
  from {
    opacity: 0.7;
  }
  to {
    opacity: 0.4;
  }

`

const Circle = styled.circle`
  animation: ${opacityAnimation} 1s ease-in-out infinite alternate;
`

export const chartDataOption: ChartDataset<'doughnut', number[]> = {
  data: [],
  backgroundColor: ['#F35E79', '#27B9C4', '#8051D6', '#129E7D', '#FCC631', '#2882CC', '#3DDBB5'],
  hoverBorderColor: ['#F35E7952', '#27B9C452', '#8051D652', '#129E7D52', '#FCC63152', '#2882CC52', '#3DDBB552'],
  hoverBorderWidth: 10,
  borderRadius: 8,
  spacing: 20,
  borderWidth: 0,
}
export const WeightsPieChart: React.FC<{
  data?: GaugeVoting[]
  totalGaugesWeight: number
  isLoading?: boolean
}> = ({ data, totalGaugesWeight, isLoading }) => {
  const tooltipRef = useRef<string | null>(null)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 })
  const [selectedGauge, setSelectedGauge] = useState<GaugeVoting>()
  const [color, setColor] = useState<string>('')
  const { isDesktop } = useMatchBreakpoints()

  const gauges = useMemo<ChartData<'doughnut'>>(() => {
    return {
      labels: data?.map((gauge) => gauge.hash) ?? [],
      datasets: [
        {
          ...chartDataOption,
          data: data?.map((gauge) => gauge.weight) ?? [],
        },
      ],
    }
  }, [data])

  const externalTooltipHandler = useCallback(
    ({ tooltip }: { tooltip: TooltipModel<'doughnut'>; chart: ChartJS }) => {
      // hide tooltip
      if (tooltip.opacity === 0) {
        setTooltipVisible(false)
        setSelectedGauge(undefined)
        tooltipRef.current = null
        return
      }
      // already visible
      if (tooltipRef.current === `${tooltip.x},${tooltip.y}`) {
        return
      }

      // set tooltip visible
      tooltipRef.current = `${tooltip.x},${tooltip.y}`
      setSelectedGauge(data?.find((gauge) => gauge.hash === tooltip.title[0]))
      setColor(tooltip.labelColors[0].backgroundColor as string)
      setTooltipVisible(true)
      setTooltipPosition({
        // left: tooltip.caretX,
        // top: tooltip.caretY,
        left: tooltip.x + 50,
        top: tooltip.y + 20,
      })
    },
    [data],
  )

  const tooltipComp = (
    <ChartTooltip
      visible={tooltipVisible}
      total={totalGaugesWeight}
      color={color}
      gauge={selectedGauge}
      allGauges={data}
    />
  )
  const tooltipNode = isDesktop ? (
    <Absolute left={tooltipPosition.left} top={tooltipPosition.top}>
      {tooltipComp}
    </Absolute>
  ) : (
    <Flex alignItems="center" flexDirection="column" mt="0.5em">
      {tooltipComp}
    </Flex>
  )
  const label = (
    <Center>
      <ChartLabel total={totalGaugesWeight} gauge={selectedGauge} />
    </Center>
  )
  const chart = isLoading ? (
    <Box ml="20px">
      <svg width="293" height="293" viewBox="0 0 293 293" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Circle cx="146.5" cy="146.5" r="131.5" stroke="#E9EAEB" stroke-width="30" />
      </svg>
    </Box>
  ) : (
    <Doughnut
      data={gauges}
      options={{
        cutout: '80%',
        radius: '95%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
            external: externalTooltipHandler,
          },
        },
      }}
    />
  )

  if (isDesktop) {
    return (
      <Container width="330px">
        {label}
        {chart}
        {tooltipNode}
      </Container>
    )
  }

  return (
    <>
      <Container width="100%">
        {label}
        {chart}
      </Container>
      {tooltipNode}
    </>
  )
}
