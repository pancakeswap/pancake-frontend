import { Dispatch, SetStateAction } from 'react'
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import useTheme from 'hooks/useTheme'
import { formatAmount } from 'utils/formatInfoNumbers'
import { BarChartLoader } from 'components/ChartLoaders'
import { useChartCallbacks } from '../../../hooks/useChartCallbacks'

export type LineChartProps = {
  data: any[]
  height?: string
  chartHeight?: string
  setHoverValue: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setHoverDate: Dispatch<SetStateAction<string | undefined>> // used for label of value
} & React.HTMLAttributes<HTMLDivElement>

const CustomBar = ({
  x,
  y,
  width,
  height,
  fill,
}: {
  x: number
  y: number
  width: number
  height: number
  fill: string
}) => {
  return (
    <g>
      <rect x={x} y={y} fill={fill} width={width} height={height} rx="2" />
    </g>
  )
}

const Chart = ({ data, setHoverValue, setHoverDate }: LineChartProps) => {
  const { theme } = useTheme()
  const { onMouseLeave, onMouseMove } = useChartCallbacks(setHoverValue, setHoverDate)
  if (!data || data.length === 0) {
    return <BarChartLoader />
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 15,
          left: 0,
          bottom: 5,
        }}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tickFormatter={(time) => time.toLocaleDateString(undefined, { month: '2-digit' })}
          minTickGap={30}
        />
        <YAxis
          dataKey="value"
          tickCount={6}
          scale="linear"
          axisLine={false}
          tickLine={false}
          color={theme.colors.textSubtle}
          fontSize="12px"
          tickFormatter={(val) => `$${formatAmount(val)}`}
          orientation="right"
          tick={{ dx: 10, fill: theme.colors.textSubtle }}
        />
        <Tooltip cursor={{ fill: theme.colors.backgroundDisabled }} contentStyle={{ display: 'none' }} />
        <Bar
          dataKey="value"
          fill={theme.colors.primary}
          shape={(props) => (
            <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={theme.colors.primary} />
          )}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Chart
