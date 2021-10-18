import React from 'react'
import { Flex } from '@pancakeswap/uikit'
import Page from 'views/Page'
import PriceChartContainer from 'views/Swap/components/Chart/PriceChartContainer'
import { useDerivedSwapInfo, useSwapState } from 'state/swap/hooks'
import { Field } from 'state/swap/actions'

const Charts = () => {
  const { currencies } = useDerivedSwapInfo()
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  return (
    <Page removePadding>
      <Flex width="100%" mb="60px" justifyContent="center">
        <PriceChartContainer
          inputCurrencyId={inputCurrencyId}
          inputCurrency={currencies[Field.INPUT]}
          outputCurrencyId={outputCurrencyId}
          outputCurrency={currencies[Field.OUTPUT]}
          isChartExpanded
          setIsChartExpanded={null}
        />
      </Flex>
    </Page>
  )
}

export default Charts
