import { AutoColumn } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { SmartRouter, Trade } from '@pancakeswap/smart-router/evm'
import { TradeType } from '@pancakeswap/sdk'

import { useUserSlippageTolerance } from 'state/user/hooks'
import { AdvancedDetailsFooter } from 'views/Swap/components/AdvancedSwapDetailsDropdown'
import { TradeSummary } from 'views/Swap/components/AdvancedSwapDetails'

import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../utils/exchange'

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

  if (!loaded) {
    return null
  }

  return (
    <AdvancedDetailsFooter show={loaded}>
      <AutoColumn gap="0px">
        <TradeSummary
          slippageAdjustedAmounts={slippageAdjustedAmounts}
          inputAmount={trade?.inputAmount}
          outputAmount={trade?.outputAmount}
          tradeType={trade?.tradeType}
          priceImpactWithoutFee={priceImpactWithoutFee}
          realizedLPFee={lpFeeAmount}
          hasStablePair={hasStablePool}
        />
      </AutoColumn>
    </AdvancedDetailsFooter>
  )
}
