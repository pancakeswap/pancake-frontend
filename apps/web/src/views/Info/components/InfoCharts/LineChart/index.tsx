import { useTranslation } from '@pancakeswap/localization'
import { darkColors, lightColors } from '@pancakeswap/uikit'
import { LineChartLoader } from 'components/ChartLoaders'
import dayjs from 'dayjs'
import useTheme from 'hooks/useTheme'
import { IChartApi, createChart } from 'lightweight-charts'
import { darken } from 'polished'
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { formatAmount } from 'utils/formatInfoNumbers'

export type LineChartProps = {
  data: any[]
  setHoverValue: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setHoverDate: Dispatch<SetStateAction<string | undefined>> // used for label of value
  dateFormat?: string
} & React.HTMLAttributes<HTMLDivElement>

/**
 * Note: remember that it needs to be mounted inside the container with fixed height
 */
const LineChart = ({ data, setHoverValue, setHoverDate, dateFormat = 'h:mm a' }: LineChartProps) => {
  const { isDark } = useTheme()
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartCreated, setChart] = useState<IChartApi | undefined>()

  const transformedData = useMemo(() => {
    if (data) {
      return data.map(({ time, value }) => {
        return {
          time: time.getTime(),
          value,
        }
      })
    }
    return []
  }, [data])

  useEffect(() => {
    if (!chartRef?.current || !transformedData || transformedData.length === 0) return

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
          top: 0.1,
          bottom: 0.1,
        },
        borderVisible: false,
      },
      timeScale: {
        visible: true,
        borderVisible: false,
        secondsVisible: false,
        tickMarkFormatter: (unixTime: number) => {
          return dayjs.unix(unixTime).format(dateFormat)
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

    const newSeries = chart.addAreaSeries({
      lineWidth: 2,
      lineColor: isDark ? darkColors.secondary : lightColors.secondary,
      topColor: darken(0.01, isDark ? darkColors.secondary : lightColors.secondary),
      bottomColor: isDark ? darkColors.backgroundDisabled : lightColors.backgroundDisabled,
      priceFormat: {
        type: 'price',
        precision: 4,
        minMove: 0.0001,
      },
    })
    setChart(chart)
    newSeries.setData(transformedData)

    chart.timeScale().fitContent()

    chart.subscribeCrosshairMove((param) => {
      if (newSeries && param) {
        const timestamp = param.time as number
        if (!timestamp) return
        const now = new Date(timestamp)
        const time = `${now.toLocaleString(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'UTC',
        })} (UTC)`
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
  }, [isDark, locale, transformedData, setHoverValue, setHoverDate, dateFormat])

  return (
    <>
      {!chartCreated && <LineChartLoader />}
      <div style={{ display: 'flex', flex: 1, height: '100%' }}>
        <div style={{ flex: 1, maxWidth: '100%' }} ref={chartRef} />
      </div>
    </>
  )
}

export default LineChart
