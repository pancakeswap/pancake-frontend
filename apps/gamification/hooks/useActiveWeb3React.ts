import { ChainId } from '@pancakeswap/chains'
import { useWeb3React } from '@pancakeswap/wagmi'
import { CHAIN_QUERY_NAME, getChainId } from 'config/chains'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { getHashFromRouter } from 'utils/getHashFromRouter'
import { isChainSupported } from 'utils/wagmi'
import { useActiveChainId } from './useActiveChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

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
    const parsedQueryChainId = getChainId(router.query.chain as string)

    if (!parsedQueryChainId && chainId === ChainId.BSC) return setPrevChainId()
    if (parsedQueryChainId !== chainId && chainId && isChainSupported(chainId)) {
      const uriHash = getHashFromRouter(router)?.[0]
      const { chainId: _chainId } = router.query
      router.replace(
        {
          query: {
            chain: CHAIN_QUERY_NAME[chainId as ChainId],
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
  }, [chainId, loading, router])
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
