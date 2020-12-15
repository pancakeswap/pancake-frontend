import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { Line } from '@reactchartjs/react-chart.js'
import FixtureData from './fixtureData'

const Wrapper = styled.div``

const HistoryChart = () => {
  const TranslateString = useI18n()

  const getDataArray = (kind) => {
    return FixtureData.map((dataPoint) => {
      return dataPoint[kind]
    }).reverse()
  }

  const data = {
    labels: getDataArray('lotteryNumber'),
    datasets: [
      {
        label: 'Pool Size',
        data: getDataArray('poolSize'),
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y-axis-1',
      },
      {
        label: 'Burned',
        data: getDataArray('burned'),
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y-axis-2',
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
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-2',
          gridLines: {
            drawOnArea: false,
          },
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
