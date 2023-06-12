import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import useTheme from 'hooks/useTheme'
import { formatAmount } from 'utils/formatInfoNumbers'
import { BarChartLoader } from 'components/ChartLoaders'
import { createChart, IChartApi } from 'lightweight-charts'
import { useTranslation } from '@pancakeswap/localization'
import { format } from 'date-fns'
import { lightColors, darkColors } from '@pancakeswap/ui/tokens/colors'
import { getChartCrosshairHandler } from '@pancakeswap/uikit'

export type LineChartProps = {
  data: any[]
  height?: string
  chartHeight?: string
  setHoverValue: Dispatch<SetStateAction<number | undefined>> // used for value on hover
  setHoverDate: Dispatch<SetStateAction<string | undefined>> // used for label of value
} & React.HTMLAttributes<HTMLDivElement>

const Chart = ({ data, setHoverValue, setHoverDate }: LineChartProps) => {
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
          return format(unixTime * 1000, 'MM')
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
    newSeries.setData(transformedData)

    chart.timeScale().fitContent()

    const handleCrosshair = getChartCrosshairHandler(newSeries, locale, setHoverDate, setHoverValue)

    chart.subscribeCrosshairMove(handleCrosshair)
    chart.subscribeClick(handleCrosshair)

    // eslint-disable-next-line consistent-return
    return () => {
      chart.unsubscribeClick(handleCrosshair)
      chart.unsubscribeCrosshairMove(handleCrosshair)
      chart.remove()
    }
  }, [isDark, locale, transformedData, setHoverValue, setHoverDate])

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
