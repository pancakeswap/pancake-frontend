import React, { useEffect, Dispatch, SetStateAction } from 'react'
import { Box, Flex, Spinner } from '@pancakeswap/uikit'
import { format } from 'date-fns'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { formatAmount } from 'utils/formatInfoNumbers'

const DEFAULT_HEIGHT = '246px'

const Wrapper = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  > * {
    font-size: 1rem;
  }
`

export type LineChartProps = {
  data: any[]
  color?: string | undefined
  setValue?: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>> // used for label of valye
  value?: number
  label?: string
  height?: string
  chartHeight?: string
} & React.HTMLAttributes<HTMLDivElement>

const HoverUpdater = ({ parsedValue, label, payload, setValue, setLabel }) => {
  useEffect(() => {
    if (setValue && parsedValue !== payload.value) {
      setValue(payload.value)
    }
    const formattedTime = format(payload.time, 'MMM d, yyyy')
    if (setLabel && label !== formattedTime) setLabel(formattedTime)
  }, [parsedValue, label, payload.value, payload.time, setValue, setLabel])

  return null
}

const Chart = ({
  data,
  color = '#56B2A4',
  value,
  label,
  height = DEFAULT_HEIGHT,
  chartHeight = DEFAULT_HEIGHT,
  setValue,
  setLabel,
}: LineChartProps) => {
  const { theme } = useTheme()
  const parsedValue = value

  return (
    <Wrapper height={height}>
      {!data || data.length === 0 ? (
        <Flex height="100%" justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      ) : (
        <Box height={chartHeight}>
          <ResponsiveContainer>
            <AreaChart
              data={data}
              width={300}
              height={308}
              margin={{
                top: 5,
                right: 15,
                left: 0,
                bottom: 5,
              }}
              onMouseLeave={() => {
                if (setLabel) setLabel(undefined)
                if (setValue) setValue(undefined)
              }}
            >
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.colors.inputSecondary} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tickFormatter={(time) => format(time, 'dd')}
                minTickGap={10}
              />
              <YAxis
                dataKey="value"
                tickCount={6}
                scale="linear"
                axisLine={false}
                tickLine={false}
                fontSize="12px"
                tickFormatter={(val) => `$${formatAmount(val)}`}
                orientation="right"
                tick={{ dx: 10, fill: theme.colors.textSubtle }}
              />
              <Tooltip
                cursor={{ stroke: theme.colors.secondary }}
                contentStyle={{ display: 'none' }}
                formatter={(tooltipValue, name, props) => (
                  <HoverUpdater
                    parsedValue={parsedValue}
                    label={label}
                    payload={props.payload}
                    setValue={setValue}
                    setLabel={setLabel}
                  />
                )}
              />
              <Area dataKey="value" type="monotone" stroke={color} fill="url(#gradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Wrapper>
  )
}

export default Chart
