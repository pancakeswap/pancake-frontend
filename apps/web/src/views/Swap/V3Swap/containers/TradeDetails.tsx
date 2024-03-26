import { TradeType } from '@pancakeswap/sdk'
import { SmartRouter, SmartRouterTrade } from '@pancakeswap/smart-router'
import { AutoColumn } from '@pancakeswap/uikit'
import useLastTruthy from 'hooks/useLast'
import { memo, useMemo } from 'react'

import { AdvancedSwapDetails, TradeSummary } from 'views/Swap/components/AdvancedSwapDetails'
import { AdvancedDetailsFooter } from 'views/Swap/components/AdvancedSwapDetailsDropdown'

import { MMTradeInfo } from 'views/Swap/MMLinkPools/hooks'
import { RouteDisplayEssentials, RoutesBreakdown } from '../components'
import { useIsWrapping, useSlippageAdjustedAmounts } from '../hooks'
import { TradeEssentialForPriceBreakdown, computeTradePriceBreakdown } from '../utils/exchange'

type Trade = TradeEssentialForPriceBreakdown &
  Pick<SmartRouterTrade<TradeType>, 'tradeType'> & {
    routes: RouteDisplayEssentials[]
  }

interface Props {
  loaded: boolean
  trade?: Trade | null
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

export const TradeDetails = memo(function TradeDetails({ loaded, trade }: Props) {
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(trade ?? undefined)
  const isWrapping = useIsWrapping()
  const { priceImpactWithoutFee, lpFeeAmount } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const hasStablePool = useMemo(
    () => trade?.routes.some((route) => route.pools.some(SmartRouter.isStablePool)),
    [trade],
  )

  if (isWrapping || !loaded || !trade || !slippageAdjustedAmounts) {
    return null
  }

  const { inputAmount, outputAmount, tradeType, routes } = trade

  return (
    <AdvancedDetailsFooter show={loaded}>
      <AutoColumn gap="0px">
        <TradeSummary
          slippageAdjustedAmounts={slippageAdjustedAmounts}
          inputAmount={inputAmount}
          outputAmount={outputAmount}
          tradeType={tradeType}
          priceImpactWithoutFee={priceImpactWithoutFee ?? undefined}
          realizedLPFee={lpFeeAmount ?? undefined}
          hasStablePair={hasStablePool}
        />
        <RoutesBreakdown routes={routes} />
      </AutoColumn>
    </AdvancedDetailsFooter>
  )
})
