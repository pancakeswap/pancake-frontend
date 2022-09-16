import { useActiveChainId, useActiveNetwork } from './useNetwork'

export default function useActiveWeb3React() {
  const { networkName } = useActiveNetwork()
  const chainId = useActiveChainId()

  return {
    chainId,
    networkName,
  }
}
