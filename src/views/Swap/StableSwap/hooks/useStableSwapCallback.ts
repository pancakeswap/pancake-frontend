import { useMemo } from 'react'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useStableSwapCallback(): {
  state: SwapCallbackState
  callback: null | (() => Promise<string>)
  error: string | null
} {
  return useMemo(() => {
    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        console.log('Stable Swap')
      },
      error: null,
    }
  }, [])
}
