import useTheme from 'hooks/useTheme'
import React, { useState } from 'react'
import { TokenUpdater } from 'state/info/updaters'
import { useFetchPairPrices, useSwapActionHandlers } from 'state/swap/hooks'
import { DEFAULT_INPUT_ADDRESS } from '../constants'
import PriceChart from './PriceChart'

const timeWindowMapping = {
  0: '1',
  1: '7',
  2: '30',
  3: '365',
}

const PriceChartContainer = ({ inputCurrencyId, inputCurrency, outputCurrency, outputCurrencyId }) => {
  const [timeWindowIndex, setTimeWindowIndex] = useState<number>(0)
  const token0Address =
    inputCurrencyId && inputCurrencyId !== 'BNB' ? String(inputCurrencyId).toLowerCase() : DEFAULT_INPUT_ADDRESS
  const token1Address = outputCurrencyId ? String(outputCurrencyId).toLowerCase() : ''
  // const priceData = useTokenPriceData(
  //   String(tokenAddress).toLocaleLowerCase(),
  //   ONE_HOUR_SECONDS * timeWindowMapping[timeWindowIndex],
  //   {
  //     days: timeWindowMapping[timeWindowIndex],
  //   },
  // )
  const pairPrices = useFetchPairPrices(token0Address, token1Address)
  const { onSwitchTokens } = useSwapActionHandlers()
  const { isDark } = useTheme()
  // const lineChartData = priceData?.map((data) => ({ time: fromUnixTime(data?.time), value: data?.close })) || []

  return (
    <>
      <TokenUpdater />

      <PriceChart
        lineChartData={pairPrices}
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
