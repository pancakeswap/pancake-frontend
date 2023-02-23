import { TradeType } from '@pancakeswap/sdk'
import { Trade } from '@pancakeswap/smart-router/evm'
import { useMemo } from 'react'

import { useUserSlippageTolerance } from 'state/user/hooks'
import { computeSlippageAdjustedAmounts } from '../utils/exchange'

export function useSlippageAdjustedAmounts(trade?: Trade<TradeType>) {
  const [allowedSlippage] = useUserSlippageTolerance()
  return useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [allowedSlippage, trade])
}
