import { Web3Provider } from '@ethersproject/providers'
import { createContext, useContext } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useAccount, WagmiConfig, WagmiConfigProps } from 'wagmi'
import { Provider, WebSocketProvider } from '@wagmi/core'

export function WagmiProvider<TProvider extends Provider, TWebSocketProvider extends WebSocketProvider>(
  props: React.PropsWithChildren<WagmiConfigProps<TProvider, TWebSocketProvider>>,
) {
  return (
    <WagmiConfig client={props.client}>
      <Web3LibraryProvider>{props.children}</Web3LibraryProvider>
    </WagmiConfig>
  )
}

const Web3LibraryContext = createContext<Web3Provider | undefined>(undefined)

export const useWeb3LibraryContext = () => {
  return useContext(Web3LibraryContext)
}

const Web3LibraryProvider: React.FC<React.PropsWithChildren> = (props) => {
  const { connector } = useAccount()
  const { data: library } = useSWRImmutable(connector && ['web3-library', connector], async () => {
    const provider = await connector?.getProvider()
    return new Web3Provider(provider)
  })

  return <Web3LibraryContext.Provider value={library}>{props.children}</Web3LibraryContext.Provider>
}
