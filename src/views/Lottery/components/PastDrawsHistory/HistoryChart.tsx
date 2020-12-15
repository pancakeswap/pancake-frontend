import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Line } from '@reactchartjs/react-chart.js'
import FixtureData from './fixtureData'

const HistoryChart = () => {
  const getDataArray = (kind) => {
    return FixtureData.map((dataPoint) => {
      return dataPoint[kind]
    }).reverse()
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

  const data = {
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
        fontSize: 14,
        lineHeight,
        maxRotation: 0,
        beginAtZero: true,
        autoSkipPadding: 15,
        userCallback: (value, index, values) => {
          return value.toLocaleString()
        },
      },
    }
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
          ...axesStyles({ color: '#8f80ba', lineHeight: 1.6 }),
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-burned',
          ...axesStyles({ color: '#1FC7D4', lineHeight: 1.5 }),
        },
      ],
      xAxes: [
        {
          ...axesStyles({ color: '#452A7A', lineHeight: 1 }),
        },
      ],
    },
  }

  return (
    // @ts-ignore
    <Line data={data} options={options} />
  )
}

export default HistoryChart
