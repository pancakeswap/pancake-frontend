import { ONE_HOUR_SECONDS } from 'config/constants/info'
import { fromUnixTime } from 'date-fns'
import React, { useState } from 'react'
import { useTokenPriceData } from 'state/info/hooks'
import { PoolUpdater, ProtocolUpdater, TokenUpdater } from 'state/info/updaters'
import { DEFAULT_INPUT_ADDRESS } from '../constants'
import PriceChart from './PriceChart'

const timeWindowMapping = {
  0: '1',
  1: '7',
  2: '30',
  3: '365',
}

const PriceChartContainer = ({ inputCurrencyId }) => {
  const [timeWindowIndex, setTimeWindowIndex] = useState<number>(0)
  const tokenAddress = inputCurrencyId && inputCurrencyId !== 'BNB' ? inputCurrencyId : DEFAULT_INPUT_ADDRESS
  const priceData = useTokenPriceData(
    String(tokenAddress).toLocaleLowerCase(),
    ONE_HOUR_SECONDS * timeWindowMapping[timeWindowIndex],
    {
      days: timeWindowMapping[timeWindowIndex],
    },
  )
  const lineChartData = priceData?.map((data) => ({ time: fromUnixTime(data?.time), value: data?.close })) || []

  return (
    <>
      <TokenUpdater />
      <ProtocolUpdater />
      <PoolUpdater />

      <PriceChart
        lineChartData={lineChartData}
        timeWindowIndex={timeWindowIndex}
        setTimeWindowIndex={setTimeWindowIndex}
      />
    </>
  )
}

export default PriceChartContainer
