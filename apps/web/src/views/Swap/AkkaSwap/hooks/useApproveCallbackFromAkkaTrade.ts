import { ROUTER_ADDRESS } from 'config/constants/exchange'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { useApproveCallback } from 'hooks/useApproveCallback'
import { useMemo } from 'react'

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromAkkaTrade(inputAmount: CurrencyAmount<Currency>) {
  const amountToApprove = useMemo(() => inputAmount || undefined, [inputAmount])
  return useApproveCallback(amountToApprove, ROUTER_ADDRESS[32520][1])
}
