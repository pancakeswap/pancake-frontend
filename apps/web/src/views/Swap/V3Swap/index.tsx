/* eslint-disable @typescript-eslint/no-unused-vars */
import { SmartRouter } from '@pancakeswap/smart-router/evm'

import { FormHeader, FormMain, PricingAndSlippage, TradeDetails, SwapCommitButton } from './containers'
import { useBestTrade } from './hooks'

export function V3SwapForm() {
  const { isLoading, trade, refresh } = useBestTrade()

  const pricingAndSlippage = (
    <PricingAndSlippage priceLoading={isLoading} price={trade && SmartRouter.getExecutionPrice(trade)} />
  )
  const swapCommitButton = <SwapCommitButton trade={trade} />
  const tradeLoaded = !isLoading && !!trade

  return (
    <>
      <FormHeader refreshDisabled={!tradeLoaded} onRefresh={refresh} />
      <FormMain
        tradeLoading={isLoading}
        pricingAndSlippage={pricingAndSlippage}
        inputAmount={trade?.inputAmount}
        outputAmount={trade?.outputAmount}
        swapCommitButton={swapCommitButton}
      />

      <TradeDetails loaded={tradeLoaded} trade={trade} />
    </>
  )
}
