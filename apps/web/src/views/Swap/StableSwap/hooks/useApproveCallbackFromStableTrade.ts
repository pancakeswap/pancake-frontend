import { useMemo } from 'react'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { Field } from 'state/swap/actions'
import { computeSlippageAdjustedAmounts } from 'utils/exchange'
import { StableTrade } from './useStableTradeExactIn'

// wraps useApproveCallback in the context of a swap
export default function useApproveCallbackFromStableTrade({
  trade,
  allowedSlippage = 0,
  swapAddress,
}: {
  trade?: StableTrade
  allowedSlippage: number
  swapAddress: string
}) {
  const amountToApprove = useMemo(
    () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
    [trade, allowedSlippage],
  )

  return useApproveCallback(amountToApprove, swapAddress)
}
