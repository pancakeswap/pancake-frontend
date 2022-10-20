import { Dispatch, SetStateAction } from 'react'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts'
import useTheme from 'hooks/useTheme'
import { LineChartLoader } from 'views/Info/components/ChartLoaders'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import { useTranslation } from '@pancakeswap/localization'

export type SwapLineChartProps = {
  data: any[]
  setHoverValue: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setHoverDate: Dispatch<SetStateAction<string | undefined>> // used for label of value
  isChangePositive: boolean
  timeWindow: PairDataTimeWindowEnum
} & React.HTMLAttributes<HTMLDivElement>

const getChartColors = ({ isChangePositive }) => {
  return isChangePositive
    ? { gradient1: '#00E7B0', gradient2: '#0C8B6C', stroke: '#31D0AA' }
    : { gradient1: '#ED4B9E', gradient2: '#ED4B9E', stroke: '#ED4B9E ' }
}

const dateFormattingByTimewindow: Record<PairDataTimeWindowEnum, Intl.DateTimeFormatOptions> = {
  [PairDataTimeWindowEnum.DAY]: {
    hour: '2-digit',
    minute: '2-digit',
  },
  [PairDataTimeWindowEnum.WEEK]: {
    month: 'short',
    day: '2-digit',
  },
  [PairDataTimeWindowEnum.MONTH]: {
    month: 'short',
    day: '2-digit',
  },
  [PairDataTimeWindowEnum.YEAR]: {
    month: 'short',
    day: '2-digit',
  },
}

/**
 * Note: remember that it needs to be mounted inside the container with fixed height
 */
const LineChart = ({ data, setHoverValue, setHoverDate, isChangePositive, timeWindow }: SwapLineChartProps) => {
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const { theme } = useTheme()
  const colors = getChartColors({ isChangePositive })
  const dateFormatting = dateFormattingByTimewindow[timeWindow]

  if (!data || data.length === 0) {
    return <LineChartLoader />
  }
  return (
    <ResponsiveContainer>
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
        onMouseLeave={() => {
          if (setHoverDate) setHoverDate(undefined)
          if (setHoverValue) setHoverValue(undefined)
        }}
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.gradient1} stopOpacity={0.34} />
            <stop offset="100%" stopColor={colors.gradient2} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tickFormatter={(time) => time.toLocaleString(locale, dateFormatting)}
          minTickGap={8}
        />
        <YAxis dataKey="value" axisLine={false} tickLine={false} domain={['auto', 'auto']} hide />
        <Tooltip
          cursor={{ stroke: theme.colors.textDisabled }}
          contentStyle={{ display: 'none' }}
          formatter={(tooltipValue, name, props) => {
            setHoverValue(props.payload.value)
            setHoverDate(
              props.payload.time.toLocaleString(locale, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }),
            )
            return null
          }}
        />
        <Area dataKey="value" type="linear" stroke={colors.stroke} fill="url(#gradient)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default LineChart
