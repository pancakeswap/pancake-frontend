import { useAccount, useNetwork } from 'wagmi'

export function useWeb3React() {
  const { chain } = useNetwork()
  const { address, connector, isConnected, isConnecting } = useAccount()
  console.log(isConnected, 'isConnected')

  return {
    chainId: chain?.id,
    account: isConnected ? address : null, // TODO: migrate using `isConnected` instead of account to check wallet auth
    isConnected,
    isConnecting,
    chain,
    connector,
  }
}
