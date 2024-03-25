import { TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { useMemo } from 'react'
import { computeSlippageAdjustedAmounts } from '../utils/exchange'

export function useSlippageAdjustedAmounts(
  trade?: Pick<SmartRouterTrade<TradeType>, 'inputAmount' | 'outputAmount' | 'tradeType'> | null,
) {
  const [allowedSlippage] = useUserSlippage()
  return useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [allowedSlippage, trade])
}
