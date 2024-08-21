import { ChainId } from '@pancakeswap/chains'
import { useWeb3React } from '@pancakeswap/wagmi'
import { CHAIN_QUERY_NAME, getChainId } from 'config/chains'
import { EXCHANGE_PAGE_PATHS } from 'config/constants/exchange'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { getHashFromRouter } from 'utils/getHashFromRouter'
import { isChainSupported } from 'utils/wagmi'
import { useActiveChainId } from './useActiveChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'
import { useSessionChainId } from './useSessionChainId'

export const UNIVERSAL_PAGE_PATHS = ['/liquidity/pool/[chainName]/[id]', '/liquidity/pools', 'liquidity/positions']

export function useNetworkConnectorUpdater() {
  const { chainId } = useActiveChainId()
  const previousChainIdRef = useRef(chainId)
  const previousUrlPathRef = useRef('')
  const [loading] = useSwitchNetworkLoading()
  const router = useRouter()
  const [, setSessionChainId] = useSessionChainId()

  useEffect(() => {
    const handleRouteChange = () => {
      previousUrlPathRef.current = router.pathname
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  useEffect(() => {
    const setPrevChainId = () => {
      previousChainIdRef.current = chainId
    }
    if (loading || !router.isReady) return setPrevChainId()
    const parsedQueryChainId = getChainId(router.query.chain as string)

    if (!parsedQueryChainId && chainId === ChainId.BSC) return setPrevChainId()
    // universal page contains multiple chains,
    // so the query of chain on the url should be high priority than the activeChainId
    if (UNIVERSAL_PAGE_PATHS.includes(previousUrlPathRef.current) || UNIVERSAL_PAGE_PATHS.includes(router.pathname)) {
      return setPrevChainId()
    }
    if (parsedQueryChainId !== chainId && chainId && isChainSupported(chainId)) {
      const removeQueriesFromPath =
        previousChainIdRef.current !== chainId &&
        EXCHANGE_PAGE_PATHS.some((item) => {
          return router.pathname.startsWith(item)
        })
      const uriHash = getHashFromRouter(router)?.[0]
      const { chainId: _chainId, ...omittedQuery } = router.query
      router.replace(
        {
          query: {
            ...(!removeQueriesFromPath && omittedQuery),
            chain: CHAIN_QUERY_NAME[chainId],
          },
          ...(uriHash && { hash: uriHash }),
        },
        undefined,
        {
          shallow: true,
          scroll: false,
        },
      )
    }
    return setPrevChainId()
  }, [chainId, loading, router, setSessionChainId])
}

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = () => {
  const web3React = useWeb3React()
  const { chainId, isWrongNetwork } = useActiveChainId()

  return {
    ...web3React,
    chainId,
    isWrongNetwork,
  }
}

export default useActiveWeb3React
