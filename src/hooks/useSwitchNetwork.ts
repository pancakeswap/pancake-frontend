import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useSwitchNetwork as useSwitchNetworkWallet } from 'wagmi'
import useActiveWeb3React from './useActiveWeb3React'

export function useSwitchNetwork() {
  const { switchNetworkAsync } = useSwitchNetworkWallet()
  const { account } = useActiveWeb3React()
  const router = useRouter()

  return useCallback(
    (chainId: number) => {
      if (account && typeof switchNetworkAsync === 'function') {
        return switchNetworkAsync(chainId)
      }
      return Promise.resolve(
        router.replace({
          query: {
            ...router.query,
            chainId,
          },
        }),
      )
    },
    [account, router, switchNetworkAsync],
  )
}
