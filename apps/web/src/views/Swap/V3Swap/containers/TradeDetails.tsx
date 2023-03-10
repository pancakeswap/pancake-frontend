import { AutoColumn } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { SmartRouter, Trade } from '@pancakeswap/smart-router/evm'
import { TradeType } from '@pancakeswap/sdk'

import { AdvancedDetailsFooter } from 'views/Swap/components/AdvancedSwapDetailsDropdown'
import { TradeSummary } from 'views/Swap/components/AdvancedSwapDetails'

import { computeTradePriceBreakdown } from '../utils/exchange'
import { RoutesBreakdown } from '../components'
import { useSlippageAdjustedAmounts } from '../hooks'

interface Props {
  loaded: boolean
  trade?: Trade<TradeType> | null
}

export function TradeDetails({ loaded, trade }: Props) {
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(trade)
  const { priceImpactWithoutFee, lpFeeAmount } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const hasStablePool = useMemo(
    () => trade?.routes.some((route) => route.pools.some(SmartRouter.isStablePool)),
    [trade],
  )

  if (!loaded || !trade) {
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
          priceImpactWithoutFee={priceImpactWithoutFee}
          realizedLPFee={lpFeeAmount}
          hasStablePair={hasStablePool}
        />
        <RoutesBreakdown routes={routes} />
      </AutoColumn>
    </AdvancedDetailsFooter>
  )
}
