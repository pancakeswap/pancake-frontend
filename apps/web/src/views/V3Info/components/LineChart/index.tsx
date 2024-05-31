import dayjs from 'dayjs'
import useTheme from 'hooks/useTheme'
import { ColorType, createChart, IChartApi } from 'lightweight-charts'
import { darken } from 'polished'
import React, { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'
import usePrevious from '../../hooks/usePrevious'
import { formatDollarAmount } from '../../utils/numbers'
import Card from '../Card'
import { RowBetween } from '../Row'

const Wrapper = styled(Card)`
  width: 100%;
  display: flex;
  background-color: ${({ theme }) => theme.colors.background};
  flex-direction: column;
  > * {
    font-size: 1rem;
  }
`

const DEFAULT_HEIGHT = 300

export type LineChartProps = {
  data: any[]
  color?: string | undefined
  height?: number | undefined
  minHeight?: number
  setValue?: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>> // used for label value
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
} & React.HTMLAttributes<HTMLDivElement>

const LineChart = ({
  data,
  color = '#1FC7D4',
  setValue,
  setLabel,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  height = DEFAULT_HEIGHT,
  minHeight = DEFAULT_HEIGHT,
  ...rest
}: LineChartProps) => {
  // theming
  const { theme } = useTheme()
  const textColor = theme.isDark ? '$F4EEFF' : '#280D5F'
  // chart pointer
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartCreated, setChart] = useState<IChartApi | undefined>()
  const dataPrev = usePrevious(data)

  // reset on new data
  useEffect(() => {
    if (dataPrev !== data && chartCreated) {
      chartCreated.resize(0, 0)
      setChart(undefined)
    }
  }, [data, dataPrev, chartCreated])

  // for reseting value on hover exit
  const currentValue = data[data.length - 1]?.value

  const handleResize = useCallback(() => {
    if (chartCreated && chartRef?.current?.parentElement) {
      chartCreated.resize(chartRef.current.parentElement.clientWidth - 32, height)
      chartCreated.timeScale().fitContent()
      chartCreated.timeScale().scrollToPosition(0, false)
    }
  }, [chartCreated, chartRef, height])

  // add event listener for resize
  const isClient = typeof window === 'object'
  useEffect(() => {
    if (!isClient) {
      return
    }
    window.addEventListener('resize', handleResize)
    // eslint-disable-next-line consistent-return
    return () => window?.removeEventListener('resize', handleResize)
  }, [isClient, chartRef, handleResize]) // Empty array ensures that effect is only run on mount and unmount

  // if chart not instantiated in canvas, create it
  useEffect(() => {
    if (!chartCreated && data && !!chartRef?.current?.parentElement) {
      const chart = createChart(chartRef.current, {
        height,
        width: chartRef.current.parentElement.clientWidth - 32,
        layout: {
          background: {
            type: ColorType.Solid,
            color: 'transparent',
          },
          textColor: '#565A69',
          fontFamily: 'Inter var',
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.1,
            bottom: 0.1,
          },
          ticksVisible: false,
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
        },
        watermark: {
          color: 'rgba(0, 0, 0, 0)',
        },
        grid: {
          horzLines: {
            visible: false,
          },
          vertLines: {
            visible: false,
          },
        },
        crosshair: {
          horzLine: {
            visible: true,
            style: 0,
            width: 2,
            color: '#505050',
            labelVisible: false,
          },
          vertLine: {
            visible: true,
            style: 0,
            width: 2,
            color: '#505050',
            labelVisible: false,
          },
        },
      })
      chart.timeScale().fitContent()
      setChart(chart)
    }
  }, [color, chartCreated, currentValue, data, height, setValue, textColor, theme])

  useEffect(() => {
    if (chartCreated && data) {
      const series = chartCreated.addAreaSeries({
        lineColor: color,
        topColor: darken(0.36, color),
        bottomColor: theme.isDark ? '#08060B' : '#FAF9FA',
        lineWidth: 2,
        priceLineVisible: false,
      })
      series.setData(data)
      chartCreated.timeScale().fitContent()
      chartCreated.timeScale().scrollToRealTime()

      series.applyOptions({
        priceFormat: {
          type: 'custom',
          minMove: 0.02,
          formatter: (price: any) => formatDollarAmount(price),
        },
      })

      // update the title when hovering on the chart
      chartCreated.subscribeCrosshairMove((param) => {
        if (
          chartRef?.current &&
          (param === undefined ||
            param.time === undefined ||
            (param && param.point && param.point.x < 0) ||
            (param && param.point && param.point.x > chartRef.current.clientWidth) ||
            (param && param.point && param.point.y < 0) ||
            (param && param.point && param.point.y > height))
        ) {
          if (setValue) setValue(undefined)
          if (setLabel) setLabel(undefined)
        } else if (series && param) {
          const price = parseFloat(param?.seriesData?.get(series)?.toString() ?? currentValue)
          const time = param?.time as { day: number; year: number; month: number }
          const timeString = dayjs(`${time.year}-${time.month}-${time.day}`).format('MMM D, YYYY')
          if (setValue) setValue(price)
          if (setLabel && timeString) setLabel(timeString)
        }
      })
    }
  }, [chartCreated, color, currentValue, data, height, setLabel, setValue, theme.isDark])

  return (
    <Wrapper minHeight={minHeight}>
      <RowBetween>
        {topLeft ?? null}
        {topRight ?? null}
      </RowBetween>
      <div ref={chartRef} id="line-chart" {...rest} />
      <RowBetween>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </RowBetween>
    </Wrapper>
  )
}

export default LineChart
