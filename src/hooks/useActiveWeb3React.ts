import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from '@pancakeswap/sdk'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { bscRpcProvider } from 'utils/providers'
import { isChainSupported } from 'utils/wagmi'
import { useProvider } from 'wagmi'

export function useNetworkConnectorUpdater() {
  const localChainId = useLocalNetworkChain()
  const { chain } = useActiveWeb3React()
  const { switchNetwork, isLoading, pendingChainId } = useSwitchNetwork()
  const router = useRouter()
  const chainId = chain?.id || localChainId
  const [triedSwitchFromQuery, setTriedSwitchFromQuery] = useState(false)

  useEffect(() => {
    if (isLoading || !router.isReady) return
    const parsedQueryChainId = Number(router.query.chainId)
    if (triedSwitchFromQuery) {
      if (parsedQueryChainId !== chainId && isChainSupported(chainId)) {
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
    } else if (isChainSupported(parsedQueryChainId)) {
      setTriedSwitchFromQuery(true)
      switchNetwork(parsedQueryChainId)
    } else {
      setTriedSwitchFromQuery(true)
    }
  }, [chainId, isLoading, router, switchNetwork, triedSwitchFromQuery])

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
  const { library, chainId: connectedChainId, ...web3React } = useWeb3React()
  const chainId = connectedChainId ?? localChainId ?? ChainId.BSC
  const provider = useProvider({ chainId })

  return {
    library: (library ?? bscRpcProvider) as Web3Provider,
    provider,
    chainId,
    ...web3React,
  }
}

export default useActiveWeb3React
