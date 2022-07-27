import { Web3Provider } from '@ethersproject/providers'
import { useNetwork, useAccount, useProvider } from 'wagmi'
import { useWeb3LibraryContext } from './provider'

export function useWeb3React() {
  const { chain } = useNetwork()
  const { address, connector } = useAccount()
  const library = useWeb3LibraryContext()
  const provider = useProvider()

  return {
    library: (library || provider) as Web3Provider,
    chainId: chain?.id,
    account: address,
    connector,
  }
}
