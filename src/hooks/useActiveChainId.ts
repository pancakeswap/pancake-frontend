import { ChainId } from '@pancakeswap/sdk'
import { useRouter } from 'next/router'
import useSWRImmutable from 'swr/immutable'
import { isChainSupported } from 'utils/wagmi'
import { useAccount, useNetwork } from 'wagmi'

export function useLocalNetworkChain() {
  const { data: sessionChainId } = useSWRImmutable('session-chain-id')
  const { query } = useRouter()

  const chainId = +(sessionChainId || query.chainId)

  if (isChainSupported(chainId)) {
    return chainId
  }

  return undefined
}

export const useActiveChainId = () => {
  const localChainId = useLocalNetworkChain()
  const { status } = useAccount()
  const { chain } = useNetwork()
  const chainId =
    chain?.id ?? localChainId ?? (status !== 'connecting' && status !== 'reconnecting' ? ChainId.BSC : undefined)
  return chainId
}
