import { useCallback } from 'react'
import { useSWRConfig } from 'swr'
import { useSwitchNetwork as useSwitchNetworkWallet } from 'wagmi'
import useActiveWeb3React from './useActiveWeb3React'

export function useSwitchNetwork() {
  const { mutate } = useSWRConfig()
  const { switchNetworkAsync, ...switchNetworkArgs } = useSwitchNetworkWallet()
  const { account } = useActiveWeb3React()

  const switchNetwork = useCallback(
    (chainId: number) => {
      if (account && typeof switchNetworkAsync === 'function') {
        return switchNetworkAsync(chainId).then((c) => {
          if (c) {
            mutate('session-chain-id', c.id)
          }
        })
      }
      return mutate('session-chain-id', chainId)
    },
    [account, mutate, switchNetworkAsync],
  )

  return {
    ...switchNetworkArgs,
    switchNetwork,
  }
}
