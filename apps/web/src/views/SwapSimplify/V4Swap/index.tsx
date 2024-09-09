import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { Box } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { MMLiquidityWarning } from 'views/Swap/MMLinkPools/components/MMLiquidityWarning'
import { shouldShowMMLiquidityError } from 'views/Swap/MMLinkPools/utils/exchange'
import {
  BuyCryptoLink,
  FormHeader,
  MMTradeDetail,
  PricingAndSlippage,
  TradeDetails,
} from '../../Swap/V3Swap/containers'
import { CommitButton } from '../../Swap/V3Swap/containers/CommitButton'
import { useAllTypeBestTrade } from '../../Swap/V3Swap/hooks/useAllTypeBestTrade'
import { useCheckInsufficientError } from '../../Swap/V3Swap/hooks/useCheckSufficient'
import { FormMain } from './FormMainV4'

export function V4SwapForm() {
  const {
    bestTrade,
    ammTrade,
    mmTrade,
    isMMBetter,
    tradeError,
    tradeLoaded,
    refreshTrade,
    refreshDisabled,
    pauseQuoting,
    resumeQuoting,
  } = useAllTypeBestTrade()

  const ammPrice = useMemo(() => (ammTrade ? SmartRouter.getExecutionPrice(ammTrade) : undefined), [ammTrade])
  const insufficientFundCurrency = useCheckInsufficientError(ammTrade)
  const commitHooks = useMemo(() => {
    return {
      beforeCommit: pauseQuoting,
      afterCommit: resumeQuoting,
    }
  }, [pauseQuoting, resumeQuoting])

  return (
    <>
      <FormHeader onRefresh={refreshTrade} refreshDisabled={refreshDisabled} />
      <FormMain
        tradeLoading={isMMBetter ? false : !tradeLoaded}
        pricingAndSlippage={
          <PricingAndSlippage priceLoading={!tradeLoaded} price={ammPrice ?? undefined} showSlippage={!isMMBetter} />
        }
        inputAmount={bestTrade?.inputAmount}
        outputAmount={bestTrade?.outputAmount}
        swapCommitButton={
          <CommitButton
            trade={isMMBetter ? mmTrade : ammTrade}
            tradeError={tradeError}
            tradeLoaded={tradeLoaded}
            {...commitHooks}
          />
        }
      />

      <BuyCryptoLink currency={insufficientFundCurrency} />

      {isMMBetter ? (
        <MMTradeDetail loaded={!mmTrade.mmOrderBookTrade.isLoading} mmTrade={mmTrade.mmTradeInfo} />
      ) : (
        <TradeDetails loaded={tradeLoaded} trade={ammTrade} />
      )}
      {(shouldShowMMLiquidityError(mmTrade?.mmOrderBookTrade?.inputError) || mmTrade?.mmRFQTrade?.error) &&
        !ammTrade && (
          <Box mt="5px">
            <MMLiquidityWarning />
          </Box>
        )}
    </>
  )
}
