import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { SwapUIV2 } from '@pancakeswap/widgets-internal'
import { RiskDetailsPanel, useShouldRiskPanelDisplay } from 'components/AccessRisk/SwapRevampRiskDisplay'
import { useCurrency } from 'hooks/Tokens'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { logger } from 'utils/datadog'
import { warningSeverity } from 'utils/exchange'
import { isXOrder } from 'views/Swap/utils'
import { SwapType } from '../../Swap/types'
import { useAllTypeBestTrade } from '../../Swap/V3Swap/hooks/useAllTypeBestTrade'
import { computeTradePriceBreakdown } from '../../Swap/V3Swap/utils/exchange'
import { ButtonAndDetailsPanel } from './ButtonAndDetailsPanel'
import { CommitButton } from './CommitButton'
import { FormMain } from './FormMainV4'
import { PricingAndSlippage } from './PricingAndSlippage'
import { SwapSelection } from './SwapSelectionTab'
import { TradeDetails } from './TradeDetails'

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
            bestOrderType: bestOrder?.type,
            ammOrder: {
              type: ammOrder?.type,
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
  }, [pauseQuoting, resumeQuoting, xOrder, ammOrder, inputUsdPrice, outputUsdPrice, bestOrder?.type])
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

  const { priceImpactWithoutFee } = useMemo(
    () => computeTradePriceBreakdown(isXOrder(bestOrder) ? bestOrder?.ammTrade : bestOrder?.trade),
    [bestOrder],
  )
  const isPriceImpactTooHigh = useMemo(() => {
    const warningLevel = warningSeverity(priceImpactWithoutFee)
    return warningLevel >= 3
  }, [priceImpactWithoutFee])
  const [userSlippageTolerance] = useUserSlippage()
  const isSlippageTooHigh = useMemo(() => userSlippageTolerance > 500, [userSlippageTolerance])

  const shouldRiskPanelDisplay = useShouldRiskPanelDisplay(inputCurrency?.wrapped, outputCurrency?.wrapped)

  return (
    <SwapUIV2.SwapFormWrapper>
      <SwapUIV2.SwapTabAndInputPanelWrapper>
        <SwapSelection swapType={SwapType.MARKET} />
        <FormMain
          tradeLoading={!tradeLoaded}
          inputAmount={bestOrder?.trade?.inputAmount}
          outputAmount={bestOrder?.trade?.outputAmount}
          swapCommitButton={
            <CommitButton order={bestOrder} tradeLoaded={tradeLoaded} tradeError={tradeError} {...commitHooks} />
          }
        />
      </SwapUIV2.SwapTabAndInputPanelWrapper>
      {(shouldRiskPanelDisplay || isPriceImpactTooHigh || isSlippageTooHigh) && (
        <RiskDetailsPanel
          isPriceImpactTooHigh={isPriceImpactTooHigh}
          isSlippageTooHigh={isSlippageTooHigh}
          token0={inputCurrency?.wrapped}
          token1={outputCurrency?.wrapped}
        />
      )}
      <ButtonAndDetailsPanel
        swapCommitButton={
          <CommitButton order={bestOrder} tradeLoaded={tradeLoaded} tradeError={tradeError} {...commitHooks} />
        }
        pricingAndSlippage={
          <PricingAndSlippage priceLoading={!tradeLoaded} price={executionPrice ?? undefined} showSlippage={false} />
        }
        tradeDetails={<TradeDetails loaded={tradeLoaded} order={bestOrder} />}
      />
      {/* <TradeDetails loaded={tradeLoaded} order={bestOrder} /> */}
    </SwapUIV2.SwapFormWrapper>
  )
}
