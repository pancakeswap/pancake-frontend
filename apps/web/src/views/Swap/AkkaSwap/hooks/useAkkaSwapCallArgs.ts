import { JSBI } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { SwapCall } from 'hooks/useSwapCallArguments'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useAkkaRouterContract } from 'utils/exchange'

export default function useAkkaSwapCallArgs(trade): SwapCall[] {
  const { account } = useActiveWeb3React()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const swapContract = useAkkaRouterContract()
  const swapCalls = useMemo(() => {
    if (!trade) return []
    const args = [trade?.amountIn, trade?.amountOutMin, trade?.data, trade?.bridge, trade?.dstData, account]
    return [
      {
        parameters: {
          methodName: 'multiPathSwap',
          args,
          value: inputCurrencyId === 'BRISE' ? '' : '',
        },
        contract: swapContract,
      },
    ]
  }, [trade])

  return swapCalls
}
