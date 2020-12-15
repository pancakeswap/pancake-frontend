import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { Line } from '@reactchartjs/react-chart.js'
import FixtureData from './fixtureData'

const Wrapper = styled.div`
  height: 400px;
`

const HistoryChart = () => {
  const TranslateString = useI18n()

  const getDataArray = (kind) => {
    return FixtureData.map((dataPoint) => {
      return dataPoint[kind]
    }).reverse()
  }

  const axesStyles = ({ color }) => {
    return {
      borderCapStyle: 'round',
      gridLines: { display: false },
      ticks: { fontFamily: 'Kanit, sans-serif', fontColor: color },
    }
  }

  // const testObj = { thing: 'wat', ...axesStyles({ color: 'red' }) }

  // debugger

  const data = {
    labels: getDataArray('lotteryNumber'),
    datasets: [
      {
        label: 'Pool Size',
        data: getDataArray('poolSize'),
        fill: false,
        borderColor: '#8F80BA',
        yAxisID: 'y-axis-1',
        ...axesStyles({ color: '#8F80BA' }),
      },
      {
        label: 'Burned',
        data: getDataArray('burned'),
        fill: false,
        borderColor: '#1FC7D4',
        yAxisID: 'y-axis-2',
        ...axesStyles({ color: '#1FC7D4' }),
      },
    ],
  }

  const options = {
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
          ...axesStyles,
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-2',
          ...axesStyles,
        },
      ],
    },
  }

  return (
    <Wrapper>
      {/* @ts-ignore */}
      <Line data={data} options={options} />
    </Wrapper>
  )
}

export default HistoryChart
