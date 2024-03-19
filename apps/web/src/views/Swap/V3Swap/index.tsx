import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { Box } from '@pancakeswap/uikit'
import { EXPERIMENTAL_FEATURES } from 'config/experimentalFeatures'
import { useExperimentalFeatureEnabled } from 'hooks/useExperimentalFeatureEnabled'
import { useMemo } from 'react'
import { MMLiquidityWarning } from 'views/Swap/MMLinkPools/components/MMLiquidityWarning'
import { shouldShowMMLiquidityError } from 'views/Swap/MMLinkPools/utils/exchange'
import { BuyCryptoLink, FormHeader, FormMain, MMTradeDetail, PricingAndSlippage, TradeDetails } from './containers'
import { CommitButton } from './containers/CommitButton'
import { useAllTypeBestTrade } from './hooks/useAllTypeBestTrade'
import { useCheckInsufficientError } from './hooks/useCheckSufficient'

export function V3SwapForm() {
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

  const useUniversalRouter = useExperimentalFeatureEnabled(EXPERIMENTAL_FEATURES.UniversalRouter)
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
            useUniversalRouter={useUniversalRouter}
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
