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
      ticks: { fontFamily: 'Kanit, sans-serif', fontColor: color, fontSize: 14, lineHeight: 1.5 },
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
        yAxisID: 'y-axis-pool',
      },
      {
        label: 'Burned',
        data: getDataArray('burned'),
        fill: false,
        borderColor: '#1FC7D4',
        yAxisID: 'y-axis-burned',
      },
    ],
  }

  const options = {
    legend: { display: false },
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-pool',
          ...axesStyles({ color: '#8f80ba' }),
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-burned',
          ...axesStyles({ color: '#1FC7D4' }),
        },
      ],
      xAxes: [
        {
          ...axesStyles({ color: '#452A7A' }),
        },
      ],
    },
  }

  return (
    <Wrapper>
      {/* @ts-ignore */}
      <Line data={data} options={options} height={300} />
    </Wrapper>
  )
}

export default HistoryChart
