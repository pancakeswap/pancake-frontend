import React, { useEffect, Dispatch, SetStateAction } from 'react'
import { Box, Flex, Spinner } from '@pancakeswap/uikit'
import { format } from 'date-fns'
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts'
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
  color?: string
  height?: string
  chartHeight?: string
  setValue?: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>> // used for label of valye
  value?: number
  label?: string
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
  setValue,
  setLabel,
  value,
  label,
  height = DEFAULT_HEIGHT,
  chartHeight = DEFAULT_HEIGHT,
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
                if (setLabel) setLabel(undefined)
                if (setValue) setValue(undefined)
              }}
            >
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
                    parsedValue={parsedValue}
                    label={label}
                    payload={props.payload}
                    setValue={setValue}
                    setLabel={setLabel}
                  />
                )}
              />
              <Bar
                dataKey="value"
                fill={color}
                shape={(props) => {
                  return <CustomBar height={props.height} width={props.width} x={props.x} y={props.y} fill={color} />
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Wrapper>
  )
}

export default Chart
