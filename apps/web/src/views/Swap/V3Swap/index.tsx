import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { useMemo } from 'react'
import { OrderType } from '@pancakeswap/price-api-sdk'

import { logger } from 'utils/datadog'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'

import { BuyCryptoLink, FormHeader, FormMain, PricingAndSlippage, TradeDetails } from './containers'
import { CommitButton } from './containers/CommitButton'
import { useAllTypeBestTrade } from './hooks/useAllTypeBestTrade'
import { useCheckInsufficientError } from './hooks/useCheckSufficient'

export function V3SwapForm() {
  const {
    betterOrder,
    bestOrder,
    refreshOrder,
    tradeError,
    tradeLoaded,
    refreshDisabled,
    pauseQuoting,
    resumeQuoting,
    xOrder,
    ammOrder,
  } = useAllTypeBestTrade()
  const { data: inputUsdPrice } = useCurrencyUsdPrice(bestOrder?.trade?.inputAmount.currency)
  const { data: outputUsdPrice } = useCurrencyUsdPrice(bestOrder?.trade?.outputAmount.currency)

  const executionPrice = useMemo(
    () => (bestOrder?.trade ? SmartRouter.getExecutionPrice(bestOrder.trade) : undefined),
    [bestOrder?.trade],
  )
  const insufficientFundCurrency = useCheckInsufficientError(bestOrder)
  const commitHooks = useMemo(() => {
    return {
      beforeCommit: () => {
        pauseQuoting()
        try {
          const validTrade = ammOrder?.trade ?? xOrder?.trade
          if (!validTrade) {
            throw new Error('No valid trade to log')
          }
          const { inputAmount, tradeType, outputAmount } = validTrade
          const { currency: inputCurrency } = inputAmount
          const { currency: outputCurrency } = outputAmount
          const { chainId } = inputCurrency
          const ammInputAmount = ammOrder?.trade?.inputAmount.toExact()
          const ammOutputAmount = ammOrder?.trade?.outputAmount.toExact()
          const xInputAmount = xOrder?.trade?.inputAmount.toExact()
          const xOutputAmount = xOrder?.trade?.outputAmount.toExact()
          logger.info('X/AMM Quote Comparison', {
            chainId,
            tradeType,
            inputNative: inputCurrency.isNative,
            outputNative: outputCurrency.isNative,
            inputToken: inputCurrency.wrapped.address,
            outputToken: outputCurrency.wrapped.address,
            bestOrderType: betterOrder?.type,
            ammOrder: {
              type: ammOrder?.type,
              inputAmount: ammInputAmount,
              outputAmount: ammOutputAmount,
              inputUsdValue: inputUsdPrice && ammInputAmount ? Number(ammInputAmount) * inputUsdPrice : undefined,
              outputUsdValue: outputUsdPrice && ammOutputAmount ? Number(ammOutputAmount) * outputUsdPrice : undefined,
            },
            xOrder: xOrder
              ? {
                  filler: xOrder.type === OrderType.DUTCH_LIMIT ? xOrder.trade.orderInfo.exclusiveFiller : undefined,
                  type: xOrder.type,
                  inputAmount: xInputAmount,
                  outputAmount: xOutputAmount,
                  inputUsdValue: inputUsdPrice && xInputAmount ? Number(xInputAmount) * inputUsdPrice : undefined,
                  outputUsdValue: outputUsdPrice && xOutputAmount ? Number(xOutputAmount) * outputUsdPrice : undefined,
                }
              : undefined,
          })
        } catch (error) {
          //
        }
      },
      afterCommit: resumeQuoting,
    }
  }, [pauseQuoting, resumeQuoting, xOrder, ammOrder, inputUsdPrice, outputUsdPrice, betterOrder?.type])

  return (
    <>
      <FormHeader onRefresh={refreshOrder} refreshDisabled={refreshDisabled} />
      <FormMain
        tradeLoading={!tradeLoaded}
        pricingAndSlippage={
          <PricingAndSlippage priceLoading={!tradeLoaded} price={executionPrice ?? undefined} showSlippage={false} />
        }
        inputAmount={bestOrder?.trade?.inputAmount}
        outputAmount={bestOrder?.trade?.outputAmount}
        swapCommitButton={
          <CommitButton order={bestOrder} tradeError={tradeError} tradeLoaded={tradeLoaded} {...commitHooks} />
        }
      />

      <BuyCryptoLink currency={insufficientFundCurrency} />

      <TradeDetails loaded={tradeLoaded} order={bestOrder} />
    </>
  )
}
