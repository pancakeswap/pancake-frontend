import { Gauge } from '@pancakeswap/gauges'
import { Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import type { ChartData, ChartDataset, TooltipModel } from 'chart.js'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import styled, { keyframes } from 'styled-components'
import { Hash } from 'viem'
import { ChartLabel } from './ChartLabel'
import { ChartTooltip, OTHERS_GAUGES } from './ChartTooltip'

ChartJS.register(ArcElement, Tooltip, Legend)

const Container = styled(Box)`
  position: relative;
  margin: 0.5em auto 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .gauge-pie-chart {
    max-width: 290px !important;
    width: 290px !important;
    height: 290px !important;

    ${({ theme }) => theme.mediaQueries.sm} {
      max-width: 300px !important;
      width: 300px !important;
      height: 300px !important;
    }
  }
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

const othersColor = {
  backgroundColor: '#919191',
  hoverBorderColor: '#91919152',
}

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
  data?: Gauge[]
  totalGaugesWeight: number
  isLoading?: boolean
}> = ({ data, totalGaugesWeight, isLoading }) => {
  const tooltipRef = useRef<string | null>(null)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 })
  const [selectedGauge, setSelectedGauge] = useState<Gauge>()
  const sortedGauge = useMemo<Gauge[]>(() => data?.sort((a, b) => (a.weight < b.weight ? 1 : -1)) ?? [], [data])
  const [topGaugesAndOthers, othersIndex] = useMemo(() => {
    const maxCount = 10
    const tops = sortedGauge.slice(0, maxCount)
    const others = sortedGauge.slice(maxCount).reduce(
      (prev, curr) => {
        return {
          ...prev,
          weight: curr.weight + (prev?.weight || 0n),
        }
      },
      {
        hash: OTHERS_GAUGES as Hash,
        pairName: `Other|${sortedGauge.length - maxCount}`,
      } as Gauge,
    )

    const _topGaugesAndOthers = [...tops, others].sort((a, b) => (a.weight < b.weight ? 1 : -1)) ?? []
    const _othersIndex = _topGaugesAndOthers.findIndex((a) => a.hash === OTHERS_GAUGES)
    return [_topGaugesAndOthers, _othersIndex]
  }, [sortedGauge])
  const selectedGaugeSort = useMemo(() => {
    if (!selectedGauge) return ''
    const index = topGaugesAndOthers.findIndex((g) => g.hash === selectedGauge.hash) + 1
    if (index < 10) return `0${index}`
    return String(index)
  }, [selectedGauge, topGaugesAndOthers])
  const [color, setColor] = useState<string>('')
  const { isDesktop } = useMatchBreakpoints()

  const gauges = useMemo<ChartData<'doughnut'>>(() => {
    const options = {
      ...chartDataOption,
    }
    if (othersIndex > -1 && topGaugesAndOthers.length > 1) {
      if (Array.isArray(options.backgroundColor) && !options.backgroundColor.includes(othersColor.backgroundColor)) {
        options.backgroundColor.splice(othersIndex, 0, othersColor.backgroundColor)
      }
      if (Array.isArray(options.hoverBorderColor) && !options.hoverBorderColor.includes(othersColor.hoverBorderColor)) {
        options.hoverBorderColor.splice(othersIndex, 0, othersColor.hoverBorderColor)
      }
    }
    return {
      labels: topGaugesAndOthers?.map((gauge) => gauge.hash) ?? [],
      datasets: [
        {
          ...options,
          data: topGaugesAndOthers?.map((gauge) => Number(gauge.weight)) ?? [],
        },
      ],
    }
  }, [topGaugesAndOthers, othersIndex])

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
      setSelectedGauge(topGaugesAndOthers?.find((gauge) => gauge.hash === tooltip.title[0]))
      setColor(tooltip.labelColors[0].backgroundColor as string)
      setTooltipVisible(true)
      setTooltipPosition({
        // left: tooltip.caretX,
        // top: tooltip.caretY,
        left: tooltip.x + 50,
        top: tooltip.y + 20,
      })
    },
    [topGaugesAndOthers],
  )

  const tooltipComp = (
    <ChartTooltip
      visible={tooltipVisible}
      total={totalGaugesWeight}
      color={color}
      gauge={selectedGauge}
      sort={selectedGaugeSort}
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
    <Box ml={[0, 0, '20px']}>
      <svg className="gauge-pie-chart" viewBox="0 0 293 293" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Circle cx="146.5" cy="146.5" r="131.5" stroke="#E9EAEB" stroke-width="30" />
      </svg>
    </Box>
  ) : (
    <Doughnut
      className="gauge-pie-chart"
      data={gauges}
      options={{
        responsive: true,
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
