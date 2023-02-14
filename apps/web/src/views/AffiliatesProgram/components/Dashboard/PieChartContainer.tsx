import { Box } from '@pancakeswap/uikit'
import { PieChart, Pie, Cell } from 'recharts'

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
]
const COLORS = ['#2ECFDC', '#7645D9', '#FFBB28', '#FF8042']

const PieChartContainer = () => {
  return (
    <Box width="fit-content" margin="auto">
      <PieChart width={160} height={160}>
        <Pie cx={75} cy={75} data={data} fill="#2ECFDC" stroke="0" dataKey="value" innerRadius={60} outerRadius={80}>
          {data.map((entry, index) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </Box>
  )
}

export default PieChartContainer
