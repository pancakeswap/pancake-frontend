import React, { lazy, Suspense, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import useI18n from 'hooks/useI18n'
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
  const TranslateString = useI18n()
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

  const chartData = {
    labels: getDataArray('lotteryNumber'),
    datasets: [
      {
        label: 'Pool Size',
        data: getDataArray('poolSize'),
        yAxisID: 'y-axis-pool',
        ...lineStyles({ color: '#8F80BA' }),
      },
      {
        label: 'Burned',
        data: getDataArray('burned'),
        yAxisID: 'y-axis-burned',
        ...lineStyles({ color: '#1FC7D4' }),
      },
    ],
  }

  const axesStyles = ({ color, lineHeight }) => {
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
          return value.toLocaleString()
        },
      },
    }
  }

  const options = useMemo(() => {
    return {
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      legend: { display: false },
      scales: {
        yAxes: [
          {
            type: 'linear',
            position: 'left',
            id: 'y-axis-pool',
            ...axesStyles({ color: '#8f80ba', lineHeight: 1.6 }),
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
            ...axesStyles({ color: isDark ? '#FFFFFF' : '#452A7A', lineHeight: 1 }),
          },
        ],
      },
    }
  }, [isDark])

  return (
    <>
      {historyError && (
        <InnerWrapper>
          <Text>{TranslateString(1078, 'Error fetching data')}</Text>
        </InnerWrapper>
      )}
      {!historyError && historyData.length > 1 ? (
        <Suspense fallback={<div>{TranslateString(656, 'Loading...')}</div>}>
          {showLast === 50 || showLast === 100 ? (
            <Bar data={chartData} options={options} />
          ) : (
            <Line data={chartData} options={options} type="line" />
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
