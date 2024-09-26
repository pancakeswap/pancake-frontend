import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { SwapUIV2 } from '@pancakeswap/widgets-internal'
import { RiskDetailsPanel, useShouldRiskPanelDisplay } from 'components/AccessRisk/SwapRevampRiskDisplay'
import { useCurrency } from 'hooks/Tokens'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { SwapType } from '../../Swap/types'
import { PricingAndSlippage } from '../../Swap/V3Swap/containers'
import { CommitButton } from '../../Swap/V3Swap/containers/CommitButton'
import { useAllTypeBestTrade } from '../../Swap/V3Swap/hooks/useAllTypeBestTrade'
import { useCheckInsufficientError } from '../../Swap/V3Swap/hooks/useCheckSufficient'
import { FormMain } from './FormMainV4'
import { SwapSelection } from './SwapSelectionTab'

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
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const shouldRiskPanelDisplay = useShouldRiskPanelDisplay(inputCurrency?.wrapped, outputCurrency?.wrapped)

  return (
    <SwapUIV2.SwapFormWrapper>
      <SwapUIV2.SwapTabAndInputPanelWrapper>
        <SwapSelection swapType={SwapType.MARKET} />
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
      </SwapUIV2.SwapTabAndInputPanelWrapper>
      {shouldRiskPanelDisplay && <RiskDetailsPanel token0={inputCurrency?.wrapped} token1={outputCurrency?.wrapped} />}
    </SwapUIV2.SwapFormWrapper>
  )
}
