import { ChainId } from '@pancakeswap/chains'
import { getChainId } from 'config/chains'
import { atom, useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { useDeferredValue, useMemo } from 'react'
import { isChainSupported } from 'utils/wagmi'
import { useAccount } from 'wagmi'
import { useSessionChainId } from './useSessionChainId'

const queryChainIdAtom = atom(-1) // -1 unload, 0 no chainId on query

queryChainIdAtom.onMount = (set) => {
  const params = new URL(window.location.href).searchParams
  let chainId
  // chain has higher priority than chainId
  // keep chainId for backward compatible
  const c = params.get('chain')
  if (!c) {
    chainId = params.get('chainId')
  } else {
    chainId = getChainId(c)
  }
  if (isChainSupported(Number(chainId))) {
    set(Number(chainId))
  } else {
    set(0)
  }
}

export function useLocalNetworkChain() {
  const [sessionChainId] = useSessionChainId()
  // useRouter is kind of slow, we only get this query chainId once
  const queryChainId = useAtomValue(queryChainIdAtom)

  const { query } = useRouter()

  const chainId = +(sessionChainId || getChainId(query.chain as string) || queryChainId)

  if (isChainSupported(chainId)) {
    return chainId
  }

  return undefined
}

export const useActiveChainId = () => {
  const localChainId = useLocalNetworkChain()
  const queryChainId = useAtomValue(queryChainIdAtom)

  const { chainId: wagmiChainId } = useAccount()
  const chainId = localChainId ?? wagmiChainId ?? (queryChainId >= 0 ? ChainId.BSC : undefined)

  const isNotMatched = useDeferredValue(wagmiChainId && localChainId && wagmiChainId !== localChainId)
  const isWrongNetwork = useMemo(
    () => Boolean(((wagmiChainId && !isChainSupported(wagmiChainId)) ?? false) || isNotMatched),
    [wagmiChainId, isNotMatched],
  )

  return {
    chainId: chainId && isChainSupported(chainId) ? chainId : ChainId.BSC,
    isWrongNetwork,
    isNotMatched,
  }
}
