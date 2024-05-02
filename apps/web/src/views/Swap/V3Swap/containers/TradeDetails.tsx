import { TradeType } from '@pancakeswap/sdk'
import { SmartRouter, SmartRouterTrade } from '@pancakeswap/smart-router'
import { AutoColumn } from '@pancakeswap/uikit'
import useLastTruthy from 'hooks/useLast'
import { memo, useMemo } from 'react'

import { AdvancedSwapDetails, TradeSummary } from 'views/Swap/components/AdvancedSwapDetails'
import { AdvancedDetailsFooter } from 'views/Swap/components/AdvancedSwapDetailsDropdown'

import { PriceOrder } from '@pancakeswap/price-api-sdk'
import { MMTradeInfo } from 'views/Swap/MMLinkPools/hooks'
import { isClassicOrder, isXOrder } from 'views/Swap/utils'
import { RoutesBreakdown, XRoutesBreakdown } from '../components'
import { useIsWrapping, useSlippageAdjustedAmounts } from '../hooks'
import { computeTradePriceBreakdown } from '../utils/exchange'

interface Props {
  loaded: boolean
  order?: PriceOrder
}

export function MMTradeDetail({
  loaded,
  mmTrade,
}: {
  loaded: boolean
  mmTrade?: MMTradeInfo<SmartRouterTrade<TradeType>> | null
}) {
  const lastTrade = useLastTruthy(mmTrade?.trade)

  return (
    <AdvancedDetailsFooter show={loaded}>
      <AutoColumn gap="0px">
        {lastTrade && mmTrade && (
          <AdvancedSwapDetails
            pairs={[]}
            path={lastTrade?.routes[0].path}
            slippageAdjustedAmounts={mmTrade?.slippageAdjustedAmounts}
            realizedLPFee={mmTrade?.realizedLPFee ?? undefined}
            inputAmount={mmTrade?.inputAmount}
            outputAmount={mmTrade?.outputAmount}
            tradeType={mmTrade?.tradeType}
            priceImpactWithoutFee={mmTrade?.priceImpactWithoutFee}
            isMM
          />
        )}
      </AutoColumn>
    </AdvancedDetailsFooter>
  )
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

  if (isWrapping || !loaded || !order || !slippageAdjustedAmounts) {
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
        />
        {isXOrder(order) ? <XRoutesBreakdown /> : <RoutesBreakdown routes={order?.trade?.routes} />}
      </AutoColumn>
    </AdvancedDetailsFooter>
  )
})
