import { useUserSlippage } from '@pancakeswap/utils/user'
import { useMemo } from 'react'
import { InterfaceOrder } from 'views/Swap/utils'
import { computeSlippageAdjustedAmounts } from '../utils/exchange'

export function useSlippageAdjustedAmounts(order: InterfaceOrder | undefined | null) {
  const [allowedSlippage] = useUserSlippage()
  return useMemo(() => computeSlippageAdjustedAmounts(order, allowedSlippage), [allowedSlippage, order])
}
