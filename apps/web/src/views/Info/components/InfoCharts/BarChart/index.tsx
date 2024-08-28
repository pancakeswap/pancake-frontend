import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import useTheme from 'hooks/useTheme'
import { formatAmount } from 'utils/formatInfoNumbers'
import { BarChartLoader } from 'components/ChartLoaders'
import { createChart, IChartApi } from 'lightweight-charts'
import { useTranslation } from '@pancakeswap/localization'
import dayjs from 'dayjs'
import { lightColors, darkColors, ChartDataTimeWindowEnum, dateFormattingByTimewindow } from '@pancakeswap/uikit'

export type LineChartProps = {
  data: any[]
  height?: string
  chartHeight?: string
  timeWindow: ChartDataTimeWindowEnum
  setHoverValue: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setHoverDate: Dispatch<SetStateAction<string | undefined>> // used for label of value
} & React.HTMLAttributes<HTMLDivElement>

const Chart = ({ data, timeWindow, setHoverValue, setHoverDate }: LineChartProps) => {
  const { isDark } = useTheme()
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartCreated, setChart] = useState<IChartApi | undefined>()

  useEffect(() => {
    if (!chartRef?.current || !data || data.length === 0) return

    const chart = createChart(chartRef?.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: isDark ? darkColors.textSubtle : lightColors.textSubtle,
      },
      autoSize: true,
      handleScale: false,
      handleScroll: false,
      rightPriceScale: {
        scaleMargins: {
          top: 0.01,
          bottom: 0,
        },
        borderVisible: false,
      },
      timeScale: {
        visible: true,
        borderVisible: false,
        secondsVisible: false,
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
        },
      },
    })

    chart.applyOptions({
      localization: {
        priceFormatter: (priceValue) => formatAmount(priceValue),
      },
    })

    const newSeries = chart.addHistogramSeries({
      color: isDark ? darkColors.primary : lightColors.primary,
    })
    setChart(chart)
    newSeries.setData(data)

    chart.timeScale().fitContent()

    chart.subscribeCrosshairMove((param) => {
      if (newSeries && param) {
        const timestamp = param.time as number
        if (!timestamp) return
        const now = new Date(timestamp * 1000)
        const time = `${now.toLocaleString(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })}`
        // @ts-ignore
        const parsed = (param.seriesData.get(newSeries)?.value ?? 0) as number | undefined
        if (setHoverValue) setHoverValue(parsed)
        if (setHoverDate) setHoverDate(time)
      } else {
        if (setHoverValue) setHoverValue(undefined)
        if (setHoverDate) setHoverDate(undefined)
      }
    })

    // eslint-disable-next-line consistent-return
    return () => {
      chart.remove()
    }
  }, [isDark, locale, data, setHoverValue, setHoverDate, timeWindow])

  return (
    <>
      {!chartCreated && <BarChartLoader />}
      <div style={{ display: 'flex', flex: 1, height: '100%' }}>
        <div style={{ flex: 1, maxWidth: '100%' }} ref={chartRef} />
      </div>
    </>
  )
}

export default Chart
