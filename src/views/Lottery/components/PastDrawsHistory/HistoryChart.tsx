import React, { lazy, Suspense, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { Flex, Text } from '@pancakeswap/uikit'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import Loading from '../Loading'

const Line = lazy(() => import('./LineChartWrapper'))
const Bar = lazy(() => import('./BarChartWrapper'))

const InnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
interface HistoryChartProps {
  showLast: 'max' | number
}

const HistoryChart: React.FC<HistoryChartProps> = ({ showLast }) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { historyData, historyError } = useContext(PastLotteryDataContext)
  const getDataArray = (kind) => {
    const rawData = historyData
      .map((dataPoint) => {
        return dataPoint[kind]
      })
      .reverse()

    return showLast === 'max' ? rawData : rawData.slice(Number(showLast) * -1)
  }

  const lineStyles = ({ color }) => {
    return {
      borderColor: color,
      fill: false,
      borderWidth: 2,
      pointRadius: 0,
      pointHitRadius: 10,
    }
  }

  const chartData = () => {
    return {
      labels: getDataArray('lotteryNumber'),
      datasets: [
        {
          label: t('Pool Size'),
          data: getDataArray('poolSize'),
          yAxisID: 'y-axis-pool',
          ...lineStyles({ color: '#7A6EAA' }),
        },
        {
          label: t('Burned'),
          data: getDataArray('burned'),
          yAxisID: 'y-axis-burned',
          ...lineStyles({ color: '#1FC7D4' }),
        },
      ],
    }
  }

  const axesStyles = ({ color, lineHeight, prefix = '' }) => {
    return {
      borderCapStyle: 'round',
      gridLines: { display: false },
      ticks: {
        fontFamily: 'Kanit, sans-serif',
        fontColor: color,
        fontSize: 12,
        lineHeight,
        maxRotation: 0,
        beginAtZero: true,
        autoSkipPadding: 15,
        userCallback: (value) => {
          return `${prefix}${value.toLocaleString()}`
        },
      },
    }
  }

  const options = useMemo(() => {
    return {
      tooltips: {
        mode: 'index',
        intersect: false,
        cornerRadius: 16,
        backgroundColor: '#27262c',
        xPadding: 16,
        yPadding: 16,
        caretSize: 6,
        titleFontFamily: 'Kanit, sans-serif',
        titleFontSize: 16,
        titleMarginBottom: 8,
        bodyFontFamily: 'Kanit, sans-serif',
        bodyFontSize: 16,
        bodySpacing: 8,
        beforeBody: '##',
        callbacks: {
          title: (tooltipItem) => {
            return `${t('Round #%num%', { num: tooltipItem[0].label })}`
          },
          label: (tooltipItem) => {
            return ` ${tooltipItem.yLabel.toLocaleString()} CAKE`
          },
          labelColor: (tooltipItem, chart) => {
            return {
              borderColor: chart.config.data.datasets[tooltipItem.datasetIndex].cardBorder,
              backgroundColor: chart.config.data.datasets[tooltipItem.datasetIndex].borderColor,
            }
          },
        },
      },
      legend: { display: false },
      scales: {
        yAxes: [
          {
            type: 'linear',
            position: 'left',
            id: 'y-axis-pool',
            ...axesStyles({ color: '#7A6EAA', lineHeight: 1.6 }),
          },
          {
            type: 'linear',
            position: 'right',
            id: 'y-axis-burned',
            ...axesStyles({ color: '#1FC7D4', lineHeight: 1.5 }),
          },
        ],
        xAxes: [
          {
            ...axesStyles({ color: isDark ? '#FFFFFF' : '#452A7A', lineHeight: 1, prefix: '#' }),
          },
        ],
      },
    }
  }, [isDark, t])

  return (
    <>
      {historyError && (
        <InnerWrapper>
          <Text>{t('Error fetching data')}</Text>
        </InnerWrapper>
      )}
      {!historyError && historyData.length > 1 ? (
        <Suspense
          fallback={
            <Flex justifyContent="center">
              <Loading />
            </Flex>
          }
        >
          {showLast === 50 || showLast === 100 ? (
            <Bar data={chartData()} options={options} />
          ) : (
            <Line data={chartData()} options={options} type="line" />
          )}
        </Suspense>
      ) : (
        <InnerWrapper>
          <Loading />
        </InnerWrapper>
      )}
    </>
  )
}

export default HistoryChart
