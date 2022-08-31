import { useMemo } from 'react'

import { TradeType } from '@pancakeswap/sdk'

import useStableConfig from './useStableConfig'

export default function useStableSwapCallArgs(trade) {
  const stableConfig = useStableConfig({
    tokenAAddress: trade?.inputAmount?.currency?.address,
    tokenBAddress: trade?.outputAmount?.currency?.address,
  })
  const swapContract = stableConfig?.stableSwapContract

  const swapCalls = useMemo(() => {
    if (!trade) return []

    const args =
      trade?.tradeType === TradeType.EXACT_INPUT
        ? ['0', '1', trade?.inputAmount?.quotient?.toString(), trade?.outputAmount?.quotient?.toString()]
        : ['1', '0', trade?.outputAmount?.quotient?.toString(), trade?.inputAmount?.quotient?.toString()]

    return [
      {
        parameters: {
          methodName: 'exchange',
          args,
          value: '',
        },
        contract: swapContract,
      },
    ]
  }, [swapContract, trade])

  return swapCalls
}
