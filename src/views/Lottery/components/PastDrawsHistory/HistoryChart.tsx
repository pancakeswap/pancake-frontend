import React, { lazy, Suspense, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Text } from '@pancakeswap-libs/uikit'
import PastLotteryDataContext from 'contexts/PastLotteryDataContext'
import Loading from '../Loading'

const Line = lazy(() => import('./LineChartWrapper'))


const InnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const HistoryChart: React.FC = () => {
  const { historyData, historyError } = useContext(PastLotteryDataContext)
  const [seriesLine, setSeriesLine] = useState([]);
  const [optionsLine, setOptionsLine] = useState({});  
  const [runonce, setRunonce] = useState(false);

  const genData = () => {
    
    if ((runonce) || (historyError) || (historyData.length < 1))
      return;

    const se = [
      { name: 'Pool size', data:[] },
      { name: 'Burned', data:[] }
    ];

    for (let i = historyData.length - 1; i >= 0; i--) {
      se[0].data.push([historyData[i].lotteryNumber, historyData[i].poolSize]);
      se[1].data.push([historyData[i].lotteryNumber, historyData[i].burned]);
    }
    setSeriesLine(se);

    setOptionsLine({
      chart: {
        foreColor: '#8f80ba',
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        toolbar: {
          autoSelected: 'zoom',
          tools: {
            download: false,
          }
        }
      },
      stroke: {
        width: 2,
        curve: 'smooth',
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'top',
        labels: {
          useSeriesColors: false,
        },
      },
      markers: {
        size: 0,
      },
      colors: ["#8f80ba", "#1FC7D4"],
      fill: {
        colors: ["#8f80ba", "#1FC7D4"],
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.6,
          opacityTo: 0.2,
          stops: [10, 50, 100]
        },
      },
      yaxis: {
        labels: {
          style : {
            colors:["#8f80ba"]
          },
        },
      },
      xaxis: {
        // type: 'datetime',
        tickAmount: 10,
        labels: {
          style : {
            colors:["#8f80ba", "#8f80ba", "#8f80ba", "#8f80ba", "#8f80ba", "#8f80ba", "#8f80ba", "#8f80ba", "#8f80ba", "#8f80ba", "#8f80ba"]
          },
        }
      },
      tooltip: {
        shared: true,
        // fillSeriesColor: true,
        theme: "dark",
      }
    })
  
    setRunonce(true)
  }
  
  // init
  useEffect(() => {
    
    genData();
  
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [historyData])

  return (
    <>
      {historyError && (
        <InnerWrapper>
          <Text>Error fetching data</Text>
        </InnerWrapper>
      )}
      {!historyError && historyData.length > 1 ? (
        <Suspense fallback={<div>Loading...</div>}>

        <div id="wrapper">

          <div id="chart-line">
            {seriesLine.length &&
              <Line 
                options={optionsLine} 
                series={seriesLine} 
                type="area" 
                height={350} 
              />
            }
          </div>
        </div>

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
