import { ChainId } from '@pancakeswap/sdk'
import { atom, useAtomValue } from 'jotai'
import { useDeferredValue } from 'react'
import { atomWithLocation } from 'utils/atomWithLocation'
import { isChainSupported } from 'utils/wagmi'
import { useNetwork } from 'wagmi'
import { useSessionChainId } from './useSessionChainId'

export const sessionChainIdAtom = atom<number>(0)
export const queryChainIdAtom = atom((get) => {
  const location = get(atomWithLocation())
  if (!location) {
    return -1
  }
  const c = location.searchParams.get('chainId')
  if (isChainSupported(+c)) {
    return +c
  }
  return 0
}) // -1 unload, 0 no chainId on query

export function useLocalNetworkChain() {
  const [sessionChainId] = useSessionChainId()
  // useRouter.query is kind of slow
  const queryChainId = useAtomValue(queryChainIdAtom)

  const chainId = +(sessionChainId || queryChainId)

  if (isChainSupported(chainId)) {
    return chainId
  }

  return undefined
}

export const useActiveChainId = () => {
  const localChainId = useLocalNetworkChain()
  const queryChainId = useAtomValue(queryChainIdAtom)

  const { chain } = useNetwork()
  const chainId = localChainId ?? chain?.id ?? (queryChainId >= 0 ? ChainId.BSC : undefined)

  const isNotMatched = useDeferredValue(chain && localChainId && chain.id !== localChainId)

  return {
    chainId,
    isWrongNetwork: (chain?.unsupported ?? false) || isNotMatched,
    isNotMatched,
  }
}
