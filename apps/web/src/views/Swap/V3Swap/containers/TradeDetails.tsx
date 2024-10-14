import { SmartRouter } from '@pancakeswap/smart-router'
import { AutoColumn } from '@pancakeswap/uikit'
import { memo, useMemo } from 'react'

import { TradeSummary } from 'views/Swap/components/AdvancedSwapDetails'
import { AdvancedDetailsFooter } from 'views/Swap/components/AdvancedSwapDetailsDropdown'

import { GasTokenSelector } from 'components/Paymaster/GasTokenSelector'
import { usePaymaster } from 'hooks/usePaymaster'
import { PriceOrder } from '@pancakeswap/price-api-sdk'
import { isClassicOrder, isXOrder } from 'views/Swap/utils'
import { RoutesBreakdown, XRoutesBreakdown } from '../components'
import { useIsWrapping, useSlippageAdjustedAmounts } from '../hooks'
import { computeTradePriceBreakdown } from '../utils/exchange'

interface Props {
  loaded: boolean
  order?: PriceOrder
}

export const TradeDetails = memo(function TradeDetails({ loaded, order }: Props) {
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(order)
  const isWrapping = useIsWrapping()
  const { priceImpactWithoutFee, lpFeeAmount } = useMemo(
    () => computeTradePriceBreakdown(isXOrder(order) ? order.ammTrade : order?.trade),
    [order],
  )
  const hasStablePool = useMemo(
    () =>
      isClassicOrder(order)
        ? order.trade?.routes.some((route) => route.pools.some(SmartRouter.isStablePool))
        : undefined,
    [order],
  )

  const { isPaymasterAvailable } = usePaymaster()

  if (isWrapping || !loaded || !order || !slippageAdjustedAmounts || !order.trade) {
    return null
  }

  const { inputAmount, outputAmount, tradeType } = order.trade

  return (
    <AdvancedDetailsFooter show={loaded}>
      <AutoColumn gap="0px">
        <TradeSummary
          isX={isXOrder(order)}
          slippageAdjustedAmounts={slippageAdjustedAmounts}
          inputAmount={inputAmount}
          outputAmount={outputAmount}
          tradeType={tradeType}
          priceImpactWithoutFee={priceImpactWithoutFee ?? undefined}
          realizedLPFee={lpFeeAmount ?? undefined}
          hasStablePair={hasStablePool}
          gasTokenSelector={isPaymasterAvailable && inputAmount && <GasTokenSelector currency={inputAmount.currency} />}
        />
        {isXOrder(order) ? <XRoutesBreakdown /> : <RoutesBreakdown routes={order?.trade?.routes} />}
      </AutoColumn>
    </AdvancedDetailsFooter>
  )
})
