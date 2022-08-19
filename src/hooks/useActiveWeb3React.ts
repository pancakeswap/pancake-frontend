import { useWeb3React } from '@pancakeswap/wagmi'
import { useRouter, NextRouter } from 'next/router'
import { useEffect } from 'react'
import { isChainSupported } from 'utils/wagmi'
import { useProvider } from 'wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from './useActiveChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

const getHashFromRouter = (router: NextRouter) => {
  return router.asPath.match(/#([a-z0-9]+)/gi)
}

export function useNetworkConnectorUpdater() {
  const { chainId, isConnecting } = useActiveWeb3React()
  const [loading] = useSwitchNetworkLoading()
  const router = useRouter()

  useEffect(() => {
    if (loading || !router.isReady || isConnecting) return
    const parsedQueryChainId = Number(router.query.chainId)
    if (!parsedQueryChainId && chainId === ChainId.BSC) return
    if (parsedQueryChainId !== chainId && isChainSupported(chainId)) {
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
  }, [chainId, isConnecting, loading, router])
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
