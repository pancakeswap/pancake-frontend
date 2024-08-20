import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useCallback } from 'react'

export const useCheckShouldSwitchNetwork = () => {
  const { chainId: currentChainId } = useActiveChainId()
  const { switchNetworkAsync, canSwitch, isLoading } = useSwitchNetwork()
  return {
    isLoading,
    switchNetworkIfNecessary: useCallback(
      async (chainId: number) => {
        if (canSwitch && currentChainId !== chainId) {
          await switchNetworkAsync(chainId)
          return true
        }
        return false
      },
      [canSwitch, currentChainId, switchNetworkAsync],
    ),
  }
}
