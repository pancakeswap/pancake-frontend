import { useCallback, useEffect, useRef, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { ChartData, TooltipModel } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Box } from '@pancakeswap/uikit'
import { ChartTooltip } from './ChartTooltip'

ChartJS.register(ArcElement, Tooltip, Legend)

export const data: ChartData<'doughnut', number[], string> = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: ['#F35E79', '#27B9C4', '#8051D6', '#129E7D', '#FCC631', '#2882CC', '#3DDBB5'],
      hoverBorderColor: ['#F35E7952', '#27B9C452', '#8051D652', '#129E7D52', '#FCC63152', '#2882CC52', '#3DDBB552'],
      hoverBorderWidth: 10,
      borderRadius: 8,
      spacing: 20,
      borderWidth: 0,
    },
  ],
}
export const WeightsPieChart = () => {
  const tooltipRef = useRef<string | null>(null)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 })
  const externalTooltipHandler = useCallback(
    ({ tooltip, chart }: { tooltip: TooltipModel<'doughnut'>; chart: ChartJS }) => {
      console.debug('debug tooltip', tooltip)
      console.debug('debug tooltip opacity', tooltip.opacity)
      console.debug('debug tooltip title', tooltip.title)
      // hide tooltip
      if (tooltip.opacity === 0) {
        setTooltipVisible(false)
        tooltipRef.current = null
        return
      }

      // already visible
      if (tooltipRef.current === `${tooltip.x},${tooltip.y}`) {
        return
      }

      // set tooltip visible
      tooltipRef.current = `${tooltip.x},${tooltip.y}`
      setTooltipVisible(true)
      setTooltipPosition({
        // left: tooltip.caretX,
        // top: tooltip.caretY,
        left: tooltip.x + 50,
        top: tooltip.y + 20,
      })
    },
    [setTooltipVisible, setTooltipPosition],
  )
  return (
    <Box position="relative">
      {/* <ChartTooltip /> */}
      {tooltipVisible ? (
        <Box position="absolute" left={tooltipPosition.left} top={tooltipPosition.top}>
          <ChartTooltip />
        </Box>
      ) : null}
      <Doughnut
        data={data}
        options={{
          cutout: '80%',
          radius: '60%',
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
