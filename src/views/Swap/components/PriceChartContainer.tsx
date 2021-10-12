import React, { useState } from 'react'
import { ONE_HOUR_SECONDS } from 'config/constants/info'
import { fromUnixTime } from 'date-fns'
import { useTokenPriceData } from 'state/info/hooks'
import { TokenUpdater } from 'state/info/updaters'
import { useSwapActionHandlers } from 'state/swap/hooks'
import useTheme from 'hooks/useTheme'
import { DEFAULT_INPUT_ADDRESS } from '../constants'
import PriceChart from './PriceChart'

const timeWindowMapping = {
  0: '1',
  1: '7',
  2: '30',
  3: '365',
}

const PriceChartContainer = ({ inputCurrencyId, inputCurrency, outputCurrency }) => {
  const [timeWindowIndex, setTimeWindowIndex] = useState<number>(0)
  const tokenAddress = inputCurrencyId && inputCurrencyId !== 'BNB' ? inputCurrencyId : DEFAULT_INPUT_ADDRESS
  const priceData = useTokenPriceData(
    String(tokenAddress).toLocaleLowerCase(),
    ONE_HOUR_SECONDS * timeWindowMapping[timeWindowIndex],
    {
      days: timeWindowMapping[timeWindowIndex],
    },
  )
  const { onSwitchTokens } = useSwapActionHandlers()
  const { isDark } = useTheme()
  const lineChartData = priceData?.map((data) => ({ time: fromUnixTime(data?.time), value: data?.close })) || []

  return (
    <>
      <TokenUpdater />

      <PriceChart
        lineChartData={lineChartData}
        timeWindowIndex={timeWindowIndex}
        setTimeWindowIndex={setTimeWindowIndex}
        inputCurrency={inputCurrency}
        outputCurrency={outputCurrency}
        onSwitchTokens={onSwitchTokens}
        isDark={isDark}
      />
    </>
  )
}

export default PriceChartContainer
