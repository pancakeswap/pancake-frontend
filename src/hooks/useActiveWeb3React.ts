import { CHAINS, useWeb3React } from '@pancakeswap/wagmi'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from '@pancakeswap/sdk'
import { bscRpcProvider } from 'utils/providers'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { localStorageMiddleware } from './useSWRContract'

const supportedChainIds = CHAINS.map((c) => c.id)

function useLocalNetworkChain() {
  const { query } = useRouter()
  const { data: localChainId } = useSWR(!query.chainId && 'localChainId', {
    use: [localStorageMiddleware],
  })

  const chainId = (query.chainId as string) || localChainId

  if (supportedChainIds.includes(chainId)) {
    return chainId
  }

  return ChainId.BSC
}

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const localChainId = useLocalNetworkChain()
  const { library, chainId, ...web3React } = useWeb3React()

  return { library: (library ?? bscRpcProvider) as Web3Provider, chainId: chainId ?? localChainId, ...web3React }
}

export default useActiveWeb3React
