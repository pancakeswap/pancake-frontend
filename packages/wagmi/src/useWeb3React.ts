import { Chain, Connector, useAccount, useNetwork } from 'wagmi'

export function useWeb3React(): {
  chainId: number | undefined
  account: `0x${string}` | null | undefined
  isConnected: boolean
  isConnecting: boolean
  chain: (Chain & { unsupported?: boolean | undefined }) | undefined
  connector: Connector | undefined
} {
  const { chain } = useNetwork()
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
