import { useWeb3React } from '@pancakeswap/wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { Web3Provider } from '@ethersproject/providers'
import { bscRpcProvider } from 'utils/providers'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { isChainSupported } from 'utils/wagmi'
import useSWR, { useSWRConfig } from 'swr'
import usePreviousValue from './usePreviousValue'

export function useNetworkConnectorUpdater() {
  const localChainId = useLocalNetworkChain()
  const { chain } = useActiveWeb3React()
  const { mutate } = useSWRConfig()
  const previousChain = usePreviousValue(chain)
  const { switchNetwork, isLoading, pendingChainId } = useSwitchNetwork()
  const router = useRouter()
  const chainId = chain.id || localChainId

  useEffect(() => {
    // first chain connected, ask for switch chain
    if (chain && chain.id !== localChainId && localChainId && isChainSupported(localChainId)) {
      switchNetwork(localChainId)
        .catch(() => {
          mutate('session-chain-id', chain.id)
        })
        .then((res) => {
          if (res) {
            mutate('session-chain-id', res.id)
          }
        })
    }
  }, [chain, previousChain, localChainId, switchNetwork, mutate])

  useEffect(() => {
    if (isLoading || !router.isReady) return
    if (router.query.chainId !== String(chainId) && isChainSupported(chainId)) {
      router.replace(
        {
          query: {
            ...router.query,
            chainId,
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
    }
  }, [chainId, isLoading, router])

  return {
    isLoading,
    switchNetwork,
    pendingChainId,
  }
}

export function useLocalNetworkChain() {
  const { data: sessionChainId } = useSWR('session-chain-id')
  const { query } = useRouter()

  const chainId = +(sessionChainId || query.chainId)

  if (isChainSupported(chainId)) {
    return chainId
  }

  return undefined
}

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const localChainId = useLocalNetworkChain()
  const { library, chainId, ...web3React } = useWeb3React()

  return {
    library: (library ?? bscRpcProvider) as Web3Provider,
    chainId: chainId ?? localChainId ?? ChainId.BSC,
    ...web3React,
  }
}

export default useActiveWeb3React
