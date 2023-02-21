import { AutoColumn } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { SmartRouter, Trade } from '@pancakeswap/smart-router/evm'
import { TradeType } from '@pancakeswap/sdk'

import { useUserSlippageTolerance } from 'state/user/hooks'
import { AdvancedDetailsFooter } from 'views/Swap/components/AdvancedSwapDetailsDropdown'
import { TradeSummary } from 'views/Swap/components/AdvancedSwapDetails'

import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../utils/exchange'
import { RoutesBreakdown } from '../components'

interface Props {
  loaded: boolean
  trade?: Trade<TradeType> | null
}

export function TradeDetails({ loaded, trade }: Props) {
  const [allowedSlippage] = useUserSlippageTolerance()
  const slippageAdjustedAmounts = useMemo(
    () => computeSlippageAdjustedAmounts(trade, allowedSlippage),
    [allowedSlippage, trade],
  )
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
