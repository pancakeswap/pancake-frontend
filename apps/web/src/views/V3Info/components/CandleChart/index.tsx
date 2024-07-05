import {
  baseColors,
  darkColors,
  dateFormattingByTimewindow,
  lightColors,
  ChartDataTimeWindowEnum,
} from '@pancakeswap/uikit'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import useTheme from 'hooks/useTheme'
import { ColorType, IChartApi, createChart } from 'lightweight-charts'
import React, { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'
import Card from '../Card'
import { RowBetween } from '../Row'

dayjs.extend(utc)

const Wrapper = styled(Card)`
  width: 100%;
  padding: 1rem;
  display: flex;
  background-color: transparent;
  flex-direction: column;
  > * {
    font-size: 1rem;
  }
  > #candle-chart > div {
    display: none;
  }
  > #candle-chart > div:last-child {
    display: block;
  }
`

const DEFAULT_HEIGHT = 300

export type LineChartProps = {
  data?: any[]
  color?: string | undefined
  height?: number | undefined
  minHeight?: number
  setValue?: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>> // used for value label on hover
  topLeft?: ReactNode | undefined
  topRight?: ReactNode | undefined
  timeWindow: ChartDataTimeWindowEnum
  bottomLeft?: ReactNode | undefined
  bottomRight?: ReactNode | undefined
} & React.HTMLAttributes<HTMLDivElement>

const CandleChart = ({
  data,
  color = '#1FC7D4',
  setValue,
  setLabel,
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  timeWindow,
  height = DEFAULT_HEIGHT,
  minHeight = DEFAULT_HEIGHT,
  ...rest
}: LineChartProps) => {
  const { theme, isDark } = useTheme()
  const textColor = theme.colors.tertiary
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartCreated, setChart] = useState<IChartApi | undefined>()

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
    return () => window.removeEventListener('resize', handleResize)
  }, [isClient, chartRef, handleResize]) // Empty array ensures that effect is only run on mount and unmount

  // if chart not instantiated in canvas, create it
  useEffect(() => {
    if (!chartRef?.current || !data || !chartRef?.current?.parentElement) return

    const chart = createChart(chartRef.current, {
      height,
      width: chartRef.current.parentElement.clientWidth - 32,
      layout: {
        background: {
          type: ColorType.Solid,
          color: 'transparent',
        },
        textColor: theme.isDark ? darkColors.textSubtle : lightColors.textSubtle,
        fontFamily: "'Kanit', sans-serif",
        fontSize: 14,
      },
      autoSize: true,
      handleScale: false,
      handleScroll: false,
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        secondsVisible: true,
        tickMarkFormatter: (unixTime: number) => {
          return dayjs.unix(unixTime).format(dateFormattingByTimewindow[timeWindow])
        },
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
          labelVisible: true,
        },
        mode: 1,
        vertLine: {
          visible: true,
          labelVisible: false,
          style: 3,
          width: 1,
          color: isDark ? darkColors.textSubtle : lightColors.textSubtle,
          labelBackgroundColor: color,
        },
      },
    })

    chart.timeScale().fitContent()
    setChart(chart)

    const series = chart.addCandlestickSeries({
      upColor: baseColors.success,
      downColor: baseColors.failure,
      borderDownColor: baseColors.failure,
      borderUpColor: baseColors.success,
      wickDownColor: baseColors.failure,
      wickUpColor: baseColors.success,
    })

    series.setData(data)

    series.applyOptions({
      priceFormat: {
        type: 'price',
        precision: 4,
        minMove: 0.0001,
      },
    })

    // update the title when hovering on the chart
    chart.subscribeCrosshairMove((param) => {
      if (
        chartRef?.current &&
        (param === undefined ||
          param.time === undefined ||
          (param && param.point && param.point.x < 0) ||
          (param && param.point && param.point.x > chartRef.current.clientWidth) ||
          (param && param.point && param.point.y < 0) ||
          (param && param.point && param.point.y > height))
      ) {
        // reset values
        if (setValue) setValue(undefined)
        if (setLabel) setLabel(undefined)
      } else if (series && param) {
        const timestamp = param.time as number
        const time = `${dayjs.unix(timestamp).format('MMM D, YYYY h:mm a')}`
        const parsed = param.seriesData.get(series) as { close: number } | undefined
        if (setValue) setValue(parsed?.close)
        if (setLabel) setLabel(time)
      }
    })

    // eslint-disable-next-line consistent-return
    return () => {
      chart.remove()
    }
  }, [color, chartCreated, data, height, setValue, textColor, theme, isDark, setLabel, timeWindow])

  return (
    <Wrapper minHeight={minHeight}>
      <RowBetween>
        {topLeft ?? null}
        {topRight ?? null}
      </RowBetween>
      <div ref={chartRef} id="candle-chart" {...rest} />
      <RowBetween>
        {bottomLeft ?? null}
        {bottomRight ?? null}
      </RowBetween>
    </Wrapper>
  )
}

export default CandleChart
