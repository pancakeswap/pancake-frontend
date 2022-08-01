import { useCallback } from 'react'
import { useSWRConfig } from 'swr'
import { useSwitchNetwork as useSwitchNetworkWallet } from 'wagmi'
import useActiveWeb3React from './useActiveWeb3React'

export function useSwitchNetwork() {
  const { switchNetworkAsync } = useSwitchNetworkWallet()
  const { account } = useActiveWeb3React()
  const { mutate } = useSWRConfig()

  return useCallback(
    (chainId: number) => {
      if (account) {
        return switchNetworkAsync(chainId)
      }
      return mutate('localChainId', chainId)
    },
    [account, mutate, switchNetworkAsync],
  )
}
