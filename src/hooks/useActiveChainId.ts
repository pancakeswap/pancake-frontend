import { ChainId } from '@pancakeswap/sdk'
import { useRouter } from 'next/router'
import useSWRImmutable from 'swr/immutable'
import { isChainSupported } from 'utils/wagmi'
import { useNetwork } from 'wagmi'

export function useLocalNetworkChain() {
  const { data: sessionChainId } = useSWRImmutable('session-chain-id')
  // useRouter is kind of slow, we only get this query chainId once
  const { data: queryChainId } = useSWRImmutable('query-chain-id', () => {
    const params = new URL(window.location.href).searchParams
    return params.get('chainId')
  })

  const { query } = useRouter()

  const chainId = +(sessionChainId || query.chainId || queryChainId)

  if (isChainSupported(chainId)) {
    return chainId
  }

  return undefined
}

export const useActiveChainId = () => {
  const localChainId = useLocalNetworkChain()
  const { isValidating } = useSWRImmutable('query-chain-id')
  const { data: isLoading } = useSWRImmutable('switch-network-loading')
  const { chain } = useNetwork()
  const chainId = localChainId ?? chain?.id ?? (!isValidating ? ChainId.BSC : undefined)

  return {
    chainId,
    isWrongNetwork: chain?.unsupported || isLoading ? false : chain && localChainId && chain.id !== localChainId,
  }
}
