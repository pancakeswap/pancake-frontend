import { Box } from '@pancakeswap/uikit'
import { ChartInfo } from 'views/AffiliatesProgram/components/Dashboard/CommissionInfo'
import { PieChart } from 'react-minimal-pie-chart'
import { useMemo } from 'react'

interface PieChartContainerProps {
  chartData: ChartInfo[]
}

const PieChartContainer: React.FC<React.PropsWithChildren<PieChartContainerProps>> = ({ chartData }) => {
  const transformedData = useMemo(() => {
    return chartData.map((chartInfo) => {
      return { title: chartInfo.name, value: chartInfo.cakeValueAsNumber, color: chartInfo.chartColor }
    })
  }, [chartData])

  return (
    <Box width="fit-content" margin="auto">
      <PieChart data={transformedData} animate lineWidth={25} style={{ height: '160px' }} />
    </Box>
  )
}

export default PieChartContainer
