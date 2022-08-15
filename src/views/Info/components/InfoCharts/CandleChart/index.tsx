import { useRef, useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { createChart, IChartApi } from 'lightweight-charts'
import { format } from 'date-fns'
import useTheme from 'hooks/useTheme'
import { CandleChartLoader } from 'views/Info/components/ChartLoaders'

const CANDLE_CHART_HEIGHT = 250

export type LineChartProps = {
  data: any[]
  setValue?: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setLabel?: Dispatch<SetStateAction<string | undefined>> // used for value label on hover
} & React.HTMLAttributes<HTMLDivElement>

const CandleChart = ({ data, setValue, setLabel, ...rest }: LineChartProps) => {
  const { theme } = useTheme()
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartCreated, setChart] = useState<IChartApi | undefined>()

  const handleResize = useCallback(() => {
    if (chartCreated && chartRef?.current?.parentElement) {
      chartCreated.resize(chartRef.current.parentElement.clientWidth - 32, CANDLE_CHART_HEIGHT)
      chartCreated.timeScale().fitContent()
      chartCreated.timeScale().scrollToPosition(0, false)
    }
  }, [chartCreated, chartRef])

  // add event listener for resize
  const isClient = typeof window === 'object'
  useEffect(() => {
    if (!isClient) {
      return null
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isClient, chartRef, handleResize]) // Empty array ensures that effect is only run on mount and unmount

  // if chart not instantiated in canvas, create it
  useEffect(() => {
    if (!chartCreated && data && !!chartRef?.current?.parentElement) {
      const chart = createChart(chartRef.current, {
        height: CANDLE_CHART_HEIGHT,
        width: chartRef.current.parentElement.clientWidth - 32,
        layout: {
          backgroundColor: 'transparent',
          textColor: theme.colors.textSubtle,
          fontFamily: 'Kanit, sans-serif',
          fontSize: 12,
        },
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
            return format(unixTime * 1000, 'MM/dd h:mm a')
          },
        },
        watermark: {
          visible: false,
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
            visible: false,
            labelVisible: false,
          },
          mode: 1,
          vertLine: {
            visible: true,
            labelVisible: false,
            style: 3,
            width: 1,
            color: theme.colors.textSubtle,
            labelBackgroundColor: theme.colors.primary,
          },
        },
      })

      chart.timeScale().fitContent()
      setChart(chart)
    }
  }, [chartCreated, data, setValue, theme])

  useEffect(() => {
    if (chartCreated && data) {
      const series = chartCreated.addCandlestickSeries({
        upColor: theme.colors.success,
        downColor: theme.colors.failure,
        borderDownColor: theme.colors.failure,
        borderUpColor: theme.colors.success,
        wickDownColor: theme.colors.failure,
        wickUpColor: theme.colors.success,
      })

      series.setData(data)

      // update the title when hovering on the chart
      chartCreated.subscribeCrosshairMove((param) => {
        if (
          chartRef?.current &&
          (param === undefined ||
            param.time === undefined ||
            (param && param.point && param.point.x < 0) ||
            (param && param.point && param.point.x > chartRef.current.clientWidth) ||
            (param && param.point && param.point.y < 0) ||
            (param && param.point && param.point.y > CANDLE_CHART_HEIGHT))
        ) {
          // reset values
          if (setValue) setValue(undefined)
          if (setLabel) setLabel(undefined)
        } else if (series && param) {
          const timestamp = param.time as number
          const now = new Date(timestamp * 1000)
          const time = `${now.toLocaleString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZone: 'UTC',
          })} (UTC)`
          const parsed = param.seriesPrices.get(series) as { open: number } | undefined
          if (setValue) setValue(parsed?.open)
          if (setLabel) setLabel(time)
        }
      })
    }
  }, [locale, chartCreated, data, setValue, setLabel, theme])

  return (
    <>
      {!chartCreated && <CandleChartLoader />}
      <div ref={chartRef} id="candle-chart" {...rest} />
    </>
  )
}

export default CandleChart
