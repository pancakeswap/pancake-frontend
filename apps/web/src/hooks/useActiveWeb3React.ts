import { useWeb3React } from '@pancakeswap/wagmi'
import { useRouter, NextRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { EXCHANGE_PAGE_PATHS } from 'config/constants/exchange'
import { isChainSupported } from 'utils/wagmi'
import { useProvider } from 'wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from './useActiveChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

const getHashFromRouter = (router: NextRouter) => {
  return router.asPath.match(/#([a-z0-9]+)/gi)
}

export function useNetworkConnectorUpdater() {
  const { chainId } = useActiveChainId()
  const previousChainIdRef = useRef(chainId)
  const [loading] = useSwitchNetworkLoading()
  const router = useRouter()

  useEffect(() => {
    const setPrevChainId = () => {
      previousChainIdRef.current = chainId
    }
    if (loading || !router.isReady) return setPrevChainId()
    const parsedQueryChainId = Number(router.query.chainId)
    if (!parsedQueryChainId && chainId === ChainId.BSC) return setPrevChainId()
    if (parsedQueryChainId !== chainId && isChainSupported(chainId)) {
      const removeQueriesFromPath =
        previousChainIdRef.current !== chainId &&
        EXCHANGE_PAGE_PATHS.some((item) => {
          return router.pathname.startsWith(item)
        })
      const uriHash = getHashFromRouter(router)?.[0]
      router.replace(
        {
          query: {
            ...(!removeQueriesFromPath && router.query),
            chainId,
          },
          ...(uriHash && { hash: uriHash }),
        },
        undefined,
      )
    }
    return setPrevChainId()
  }, [chainId, loading, router])
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
