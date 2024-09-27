import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { SwapUIV2 } from '@pancakeswap/widgets-internal'
import { RiskDetailsPanel, useShouldRiskPanelDisplay } from 'components/AccessRisk/SwapRevampRiskDisplay'
import { useCurrency } from 'hooks/Tokens'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { logger } from 'utils/datadog'
import { SwapType } from '../../Swap/types'
import { PricingAndSlippage } from '../../Swap/V3Swap/containers'
import { CommitButton } from '../../Swap/V3Swap/containers/CommitButton'
import { useAllTypeBestTrade } from '../../Swap/V3Swap/hooks/useAllTypeBestTrade'
import { FormMain } from './FormMainV4'
import { SwapSelection } from './SwapSelectionTab'

export function V4SwapForm() {
  const {
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

  const commitHooks = useMemo(() => {
    return {
      beforeCommit: () => {
        pauseQuoting()
        try {
          const validTrade = ammOrder.trade ?? xOrder?.trade
          if (!validTrade) {
            throw new Error('No valid trade to log')
          }
          const { inputAmount, tradeType, outputAmount } = validTrade
          const { currency: inputCurrency } = inputAmount
          const { currency: outputCurrency } = outputAmount
          const { chainId } = inputCurrency
          const ammInputAmount = ammOrder.trade?.inputAmount.toExact()
          const ammOutputAmount = ammOrder.trade?.outputAmount.toExact()
          const xInputAmount = xOrder?.trade?.inputAmount.toExact()
          const xOutputAmount = xOrder?.trade?.outputAmount.toExact()
          logger.info('X/AMM Quote Comparison', {
            chainId,
            tradeType,
            inputNative: inputCurrency.isNative,
            outputNative: outputCurrency.isNative,
            inputToken: inputCurrency.wrapped.address,
            outputToken: outputCurrency.wrapped.address,
            bestOrderType: bestOrder.type,
            ammOrder: {
              type: ammOrder.type,
              inputAmount: ammInputAmount,
              outputAmount: ammOutputAmount,
              inputUsdValue: inputUsdPrice && ammInputAmount ? Number(ammInputAmount) * inputUsdPrice : undefined,
              outputUsdValue: outputUsdPrice && ammOutputAmount ? Number(ammOutputAmount) * outputUsdPrice : undefined,
            },
            xOrder: xOrder
              ? {
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
  }, [pauseQuoting, resumeQuoting, xOrder, ammOrder, inputUsdPrice, outputUsdPrice, bestOrder.type])
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const executionPrice = useMemo(
    () => (bestOrder?.trade ? SmartRouter.getExecutionPrice(bestOrder.trade) : undefined),
    [bestOrder?.trade],
  )

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const shouldRiskPanelDisplay = useShouldRiskPanelDisplay(inputCurrency?.wrapped, outputCurrency?.wrapped)

  return (
    <SwapUIV2.SwapFormWrapper>
      <SwapUIV2.SwapTabAndInputPanelWrapper>
        <SwapSelection swapType={SwapType.MARKET} />
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
      </SwapUIV2.SwapTabAndInputPanelWrapper>
      {shouldRiskPanelDisplay && <RiskDetailsPanel token0={inputCurrency?.wrapped} token1={outputCurrency?.wrapped} />}
    </SwapUIV2.SwapFormWrapper>
  )
}
