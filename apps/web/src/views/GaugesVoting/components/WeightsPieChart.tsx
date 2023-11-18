import { Box } from '@pancakeswap/uikit'
import type { ChartData, ChartDataset, TooltipModel } from 'chart.js'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'
import styled from 'styled-components'
import { GaugeVoting } from '../hooks/useGaugesVoting'
import { ChartLabel } from './ChartLabel'
import { ChartTooltip } from './ChartTooltip'

ChartJS.register(ArcElement, Tooltip, Legend)

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
}> = ({ data, totalGaugesWeight }) => {
  const tooltipRef = useRef<string | null>(null)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 })
  const [selectedGauge, setSelectedGauge] = useState<GaugeVoting>()
  const [color, setColor] = useState<string>('')

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
      console.debug('debug tooltip', tooltip)
      console.debug('debug tooltip opacity', tooltip.opacity)
      console.debug('debug tooltip title', tooltip.title)
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
  return (
    <Box position="relative" pr="90px">
      <Center style={{ marginLeft: '-45px' }}>
        <ChartLabel total={totalGaugesWeight} gauge={selectedGauge} />
      </Center>
      <Absolute left={tooltipPosition.left} top={tooltipPosition.top}>
        <ChartTooltip
          visible={tooltipVisible}
          total={totalGaugesWeight}
          color={color}
          gauge={selectedGauge}
          allGauges={data}
        />
      </Absolute>
      <Doughnut
        style={{
          marginTop: '-120px',
          marginBottom: '-120px',
        }}
        data={gauges}
        options={{
          cutout: '80%',
          radius: '50%',
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
    </Box>
  )
}
