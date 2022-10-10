import { useEffect, Dispatch, SetStateAction } from 'react'
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts'
import useTheme from 'hooks/useTheme'
import { formatAmount } from 'utils/formatInfoNumbers'
import { BarChartLoader } from 'views/Info/components/ChartLoaders'
import { useTranslation } from '@pancakeswap/localization'

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

// Calls setHoverValue and setHoverDate when part of chart is hovered
// Note: this NEEDs to be wrapped inside component and useEffect, if you plug it as is it will create big render problems (try and see console)
const HoverUpdater = ({ locale, payload, setHoverValue, setHoverDate }) => {
  useEffect(() => {
    setHoverValue(payload.value)
    setHoverDate(payload.time.toLocaleString(locale, { year: 'numeric', day: 'numeric', month: 'short' }))
  }, [locale, payload.value, payload.time, setHoverValue, setHoverDate])

  return null
}

const Chart = ({ data, setHoverValue, setHoverDate }: LineChartProps) => {
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const { theme } = useTheme()
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
        onMouseLeave={() => {
          setHoverDate(undefined)
          setHoverValue(undefined)
        }}
      >
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tickFormatter={(time) => time.toLocaleDateString(undefined, { day: '2-digit' })}
          minTickGap={10}
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
        <Tooltip
          cursor={{ fill: theme.colors.backgroundDisabled }}
          contentStyle={{ display: 'none' }}
          formatter={(tooltipValue, name, props) => (
            <HoverUpdater
              locale={locale}
              payload={props.payload}
              setHoverValue={setHoverValue}
              setHoverDate={setHoverDate}
            />
          )}
        />
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
