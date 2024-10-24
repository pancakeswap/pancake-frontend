import { OrderType } from '@pancakeswap/price-api-sdk'
import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { FlexGap } from '@pancakeswap/uikit'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { SwapUIV2 } from '@pancakeswap/widgets-internal'
import { useTokenRisk } from 'components/AccessRisk'
import { RiskDetailsPanel, useShouldRiskPanelDisplay } from 'components/AccessRisk/SwapRevampRiskDisplay'
import { useCurrency } from 'hooks/Tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { logger } from 'utils/datadog'
import { SwapType } from '../../Swap/types'
import { useIsWrapping } from '../../Swap/V3Swap/hooks'
import { useAllTypeBestTrade } from '../../Swap/V3Swap/hooks/useAllTypeBestTrade'
import { useBuyCryptoInfo } from '../hooks/useBuyCryptoInfo'
import { useIsPriceImpactTooHigh } from '../hooks/useIsPriceImpactTooHigh'
import { useUserInsufficientBalance } from '../hooks/useUserInsufficientBalance'
import { ButtonAndDetailsPanel } from './ButtonAndDetailsPanel'
import { BuyCryptoPanel } from './BuyCryptoPanel'
import { CommitButton } from './CommitButton'
import { FormMain } from './FormMainV4'
import { PricingAndSlippage } from './PricingAndSlippage'
import { RefreshButton } from './RefreshButton'
import { SwapSelection } from './SwapSelectionTab'
import { TradeDetails } from './TradeDetails'
import { TradingFee } from './TradingFee'

export function V4SwapForm() {
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

  const isWrapping = useIsWrapping()
  const { chainId: activeChianId } = useActiveChainId()
  const isUserInsufficientBalance = useUserInsufficientBalance(bestOrder)
  const { shouldShowBuyCrypto, buyCryptoLink } = useBuyCryptoInfo(bestOrder)

  const { data: inputUsdPrice } = useCurrencyUsdPrice(bestOrder?.trade?.inputAmount.currency)
  const { data: outputUsdPrice } = useCurrencyUsdPrice(bestOrder?.trade?.outputAmount.currency)

  const executionPrice = useMemo(
    () => (bestOrder?.trade ? SmartRouter.getExecutionPrice(bestOrder.trade) : undefined),
    [bestOrder?.trade],
  )
  const { isPriceImpactTooHigh } = useIsPriceImpactTooHigh(bestOrder, !tradeLoaded)

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
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const [userSlippageTolerance] = useUserSlippage()
  const isSlippageTooHigh = useMemo(() => userSlippageTolerance > 500, [userSlippageTolerance])
  const shouldRiskPanelDisplay = useShouldRiskPanelDisplay(inputCurrency?.wrapped, outputCurrency?.wrapped)
  const token0Risk = useTokenRisk(inputCurrency?.wrapped)
  const token1Risk = useTokenRisk(outputCurrency?.wrapped)

  return (
    <SwapUIV2.SwapFormWrapper>
      <SwapUIV2.SwapTabAndInputPanelWrapper>
        <SwapSelection swapType={SwapType.MARKET} withToolkit />
        <FormMain
          tradeLoading={!tradeLoaded}
          inputAmount={bestOrder?.trade?.inputAmount}
          outputAmount={bestOrder?.trade?.outputAmount}
          swapCommitButton={
            <CommitButton order={bestOrder} tradeLoaded={tradeLoaded} tradeError={tradeError} {...commitHooks} />
          }
          isUserInsufficientBalance={isUserInsufficientBalance}
        />
      </SwapUIV2.SwapTabAndInputPanelWrapper>
      {shouldShowBuyCrypto && <BuyCryptoPanel link={buyCryptoLink} />}
      {(shouldRiskPanelDisplay || isPriceImpactTooHigh || isSlippageTooHigh) && (
        <RiskDetailsPanel
          isPriceImpactTooHigh={isPriceImpactTooHigh}
          isSlippageTooHigh={isSlippageTooHigh}
          token0={inputCurrency?.wrapped}
          token1={outputCurrency?.wrapped}
          token0RiskLevelDescription={token0Risk.data?.riskLevelDescription}
          token1RiskLevelDescription={token1Risk.data?.riskLevelDescription}
        />
      )}
      <ButtonAndDetailsPanel
        swapCommitButton={
          <CommitButton order={bestOrder} tradeLoaded={tradeLoaded} tradeError={tradeError} {...commitHooks} />
        }
        pricingAndSlippage={
          <FlexGap
            alignItems="center"
            flexWrap="wrap"
            justifyContent="space-between"
            width="calc(100% - 20px)"
            gap="8px"
          >
            <FlexGap
              onClick={(e) => {
                e.stopPropagation()
              }}
              alignItems="center"
              flexWrap="wrap"
            >
              <RefreshButton
                onRefresh={refreshOrder}
                refreshDisabled={refreshDisabled}
                chainId={activeChianId}
                loading={!tradeLoaded}
              />
              <PricingAndSlippage
                priceLoading={!tradeLoaded}
                price={executionPrice ?? undefined}
                showSlippage={false}
              />
            </FlexGap>
            <TradingFee loaded={tradeLoaded} order={bestOrder} />
          </FlexGap>
        }
        tradeDetails={<TradeDetails loaded={tradeLoaded} order={bestOrder} />}
        shouldRenderDetails={Boolean(executionPrice) && Boolean(bestOrder) && !isWrapping}
      />
    </SwapUIV2.SwapFormWrapper>
  )
}
