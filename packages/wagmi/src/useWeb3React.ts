import { Chain } from 'viem'
import { Connector, useAccount } from 'wagmi'

export function useWeb3React(): {
  chainId: number | undefined
  account: `0x${string}` | null | undefined
  isConnected: boolean
  isConnecting: boolean
  chain: Chain | undefined
  connector: Connector | undefined
} {
  const { chain } = useAccount()
  const { address, connector, isConnected, isConnecting } = useAccount()

  return {
    chainId: chain?.id,
    account: isConnected ? address : null, // TODO: migrate using `isConnected` instead of account to check wallet auth
    isConnected,
    isConnecting,
    chain,
    connector,
  }
}
