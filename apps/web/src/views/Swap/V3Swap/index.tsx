import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { Box } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { MMLiquidityWarning } from 'views/Swap/MMLinkPools/components/MMLiquidityWarning'
import { shouldShowMMLiquidityError } from 'views/Swap/MMLinkPools/utils/exchange'
import { isMMOrder } from '../utils'
import { BuyCryptoLink, FormHeader, FormMain, MMTradeDetail, PricingAndSlippage, TradeDetails } from './containers'
import { CommitButton } from './containers/CommitButton'
import { useAllTypeBestTrade } from './hooks/useAllTypeBestTrade'
import { useCheckInsufficientError } from './hooks/useCheckSufficient'

export function V3SwapForm() {
  const { bestOrder, refreshOrder, isMMBetter, tradeError, tradeLoaded, refreshDisabled, pauseQuoting, resumeQuoting } =
    useAllTypeBestTrade()

  const executionPrice = useMemo(
    () => (bestOrder?.trade ? SmartRouter.getExecutionPrice(bestOrder.trade) : undefined),
    [bestOrder?.trade],
  )
  const insufficientFundCurrency = useCheckInsufficientError(bestOrder)
  const commitHooks = useMemo(() => {
    return {
      beforeCommit: pauseQuoting,
      afterCommit: resumeQuoting,
    }
  }, [pauseQuoting, resumeQuoting])

  return (
    <>
      <FormHeader onRefresh={refreshOrder} refreshDisabled={refreshDisabled} />
      <FormMain
        tradeLoading={isMMBetter ? false : !tradeLoaded}
        pricingAndSlippage={
          <PricingAndSlippage priceLoading={!tradeLoaded} price={executionPrice ?? undefined} showSlippage={false} />
        }
        inputAmount={bestOrder?.trade?.inputAmount}
        outputAmount={bestOrder?.trade?.outputAmount}
        swapCommitButton={
          <CommitButton
            order={bestOrder}
            tradeError={tradeError}
            tradeLoaded={tradeLoaded}
            {...commitHooks}
          />
        }
      />

      <BuyCryptoLink currency={insufficientFundCurrency} />

      {isMMOrder(bestOrder) ? (
        <MMTradeDetail loaded={!bestOrder.mmOrderBookTrade?.isLoading} mmTrade={bestOrder.mmTradeInfo} />
      ) : (
        <TradeDetails loaded={tradeLoaded} order={bestOrder} />
      )}
      {isMMOrder(bestOrder) &&
        (shouldShowMMLiquidityError(bestOrder?.mmOrderBookTrade?.inputError) || bestOrder?.mmRFQTrade?.error) && (
          <Box mt="5px">
            <MMLiquidityWarning />
          </Box>
        )}
    </>
  )
}
