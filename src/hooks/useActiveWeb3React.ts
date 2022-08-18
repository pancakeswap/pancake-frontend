import { useWeb3React } from '@pancakeswap/wagmi'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useRouter, NextRouter } from 'next/router'
import { useEffect } from 'react'
import { isChainSupported } from 'utils/wagmi'
import { useProvider } from 'wagmi'
import { useActiveChainId, useLocalNetworkChain } from './useActiveChainId'

const getHashFromRouter = (router: NextRouter) => {
  return router.asPath.match(/#([a-z0-9]+)/gi)
}

export function useNetworkConnectorUpdater() {
  const localChainId = useLocalNetworkChain()
  const { chain, isConnecting } = useActiveWeb3React()
  const { switchNetwork, isLoading, pendingChainId } = useSwitchNetwork()
  const router = useRouter()
  const chainId = chain?.id || localChainId

  useEffect(() => {
    if (isLoading || !router.isReady || isConnecting) return
    const parsedQueryChainId = Number(router.query.chainId)
    if (parsedQueryChainId === chainId && isChainSupported(chainId)) {
      const uriHash = getHashFromRouter(router)?.[0]
      router.replace(
        {
          query: {
            ...router.query,
            chainId,
          },
          ...(uriHash && { hash: uriHash }),
        },
        undefined,
      )
    }
  }, [chainId, isConnecting, isLoading, router])

  return {
    isLoading,
    switchNetwork,
    pendingChainId,
  }
}

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const web3React = useWeb3React()
  const { chainId, isWrongNetwork } = useActiveChainId()
  const provider = useProvider({ chainId })

  return {
    provider,
    ...web3React,
    chainId,
    isWrongNetwork,
  }
}

export default useActiveWeb3React
