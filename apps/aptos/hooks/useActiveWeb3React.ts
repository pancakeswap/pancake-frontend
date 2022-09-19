import { useAccount, useProvider } from '@pancakeswap/awgmi'
import { useActiveChainId, useActiveNetwork } from './useNetwork'

export default function useActiveWeb3React() {
  const { networkName } = useActiveNetwork()
  const chainId = useActiveChainId()
  const provider = useProvider({ networkName })
  const { account } = useAccount()

  return {
    chainId,
    networkName,
    provider,
    account: account?.address,
  }
}
