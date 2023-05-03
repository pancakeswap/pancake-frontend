import { Box } from '@pancakeswap/uikit'
import { PieChart, Pie, Cell } from 'recharts'
import { ChartInfo } from 'views/AffiliatesProgram/components/Dashboard/CommissionInfo'

interface PieChartContainerProps {
  chartData: ChartInfo[]
}

const PieChartContainer: React.FC<React.PropsWithChildren<PieChartContainerProps>> = ({ chartData }) => {
  return (
    <Box width="fit-content" margin="auto">
      <PieChart width={160} height={160}>
        <Pie
          cx={75}
          cy={75}
          data={chartData}
          fill="#2ECFDC"
          stroke="0"
          dataKey="cakeValueAsNumber"
          innerRadius={60}
          outerRadius={80}
        >
          {chartData.map((entry) => (
            <Cell key={`cell-${entry.id}`} fill={entry.chartColor} />
          ))}
        </Pie>
      </PieChart>
    </Box>
  )
}

export default PieChartContainer
