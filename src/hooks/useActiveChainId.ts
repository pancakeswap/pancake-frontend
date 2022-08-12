import { ChainId } from '@pancakeswap/sdk'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { isChainSupported } from 'utils/wagmi'
import { useNetwork } from 'wagmi'

export function useLocalNetworkChain() {
  const { data: sessionChainId } = useSWR('session-chain-id')
  const { query } = useRouter()

  const chainId = +(sessionChainId || query.chainId)

  if (isChainSupported(chainId)) {
    return chainId
  }

  return undefined
}

export const useActiveChainId = () => {
  const localChainId = useLocalNetworkChain()
  const { chain } = useNetwork()
  const chainId = chain?.id ?? localChainId ?? ChainId.BSC
  return chainId
}
