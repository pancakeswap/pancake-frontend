import { SignMessageArgs } from '@wagmi/core'
import { useCallback } from 'react'
import { useAccount, useSignMessage as useSignMessageWagmi } from 'wagmi'

export function useSignMessage() {
  const { address, connector } = useAccount()
  const { signMessageAsync: sign } = useSignMessageWagmi()

  return {
    signMessageAsync: useCallback(
      async (args: SignMessageArgs) => {
        // @ts-ignore
        if (connector?.id === 'bsc' && window.BinanceChain && address) {
          // @ts-ignore
          const res = await window.BinanceChain.bnbSign?.(address, args.message as string)
          if (res) {
            return res.signature
          }
          return null
        }
        return sign(args)
      },
      [address, connector?.id, sign],
    ),
  }
}
