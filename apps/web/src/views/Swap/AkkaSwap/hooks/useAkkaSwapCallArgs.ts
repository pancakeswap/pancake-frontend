import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { SwapCall } from 'hooks/useSwapCallArguments'
import { useMemo } from 'react'
import { useAkkaRouterContract } from 'utils/exchange'

export default function useAkkaSwapCallArgs(trade): SwapCall[] {
  const { account } = useActiveWeb3React()
  const swapCalls = useMemo(() => {
    if (!trade) return []
    const swapContract = useAkkaRouterContract()
    const args = [trade?.amountIn, trade?.amountOutMin, trade?.data, trade?.bridge, trade?.dstData, account]

    return [
      {
        parameters: {
          methodName: 'multiPathSwap',
          args,
          value: '',
        },
        contract: swapContract,
      },
    ]
  }, [trade])

  return swapCalls
}
