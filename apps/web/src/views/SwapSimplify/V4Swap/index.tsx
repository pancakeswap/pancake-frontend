import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { useMemo } from 'react'
import { PricingAndSlippage } from '../../Swap/V3Swap/containers'
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
      {/* <FormHeader onRefresh={refreshTrade} refreshDisabled={refreshDisabled} /> */}
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
    </>
  )
}
