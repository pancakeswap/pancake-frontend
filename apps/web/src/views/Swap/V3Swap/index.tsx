/* eslint-disable @typescript-eslint/no-unused-vars */
import { SmartRouter } from '@pancakeswap/smart-router/evm'

import { FormHeader, FormMain, PricingAndSlippage, TradeDetails } from './containers'
import { useBestTrade } from './hooks'

export function V3SwapForm() {
  const { isLoading, trade } = useBestTrade()

  const pricingAndSlippage = (
    <PricingAndSlippage priceLoading={isLoading} price={trade && SmartRouter.getExecutionPrice(trade)} />
  )
  return (
    <>
      <FormHeader refreshDisabled />
      <FormMain
        tradeLoading={isLoading}
        pricingAndSlippage={pricingAndSlippage}
        inputAmount={trade?.inputAmount}
        outputAmount={trade?.outputAmount}
      />
      <TradeDetails loaded={!isLoading && !!trade} trade={trade} />
    </>
  )
}
