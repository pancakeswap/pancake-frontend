import { chains, defaultChain } from 'config/chains'
import { useNetwork } from '@pancakeswap/aptos'
import { atom, useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { isChainSupported } from 'utils'

const sessionNetworkAtom = atom<number>(0)

export const useSessionNetwork = () => useAtom(sessionNetworkAtom)

const queryNetworkAtom = atom('')

queryNetworkAtom.onMount = (set) => {
  const params = new URL(window.location.href).searchParams
  const n = params.get('network')
  if (n && isChainSupported(n)) {
    set(n.toLowerCase())
  } else {
    set(defaultChain.name)
  }
}

function useLocalNetwork() {
  const [sessionNetwork] = useSessionNetwork()
  const queryNetwork = useAtomValue(queryNetworkAtom)
  const { query } = useRouter()

  const network = sessionNetwork || query.network || queryNetwork

  if (typeof network === 'string' && isChainSupported(network)) {
    return network
  }

  return undefined
}

export function useActiveNetwork() {
  const localNetworkName = useLocalNetwork()
  const { chain } = useNetwork()
  const queryNetwork = useAtomValue(queryNetworkAtom)

  const networkName = localNetworkName ?? chain?.name ?? (queryNetwork === '' ? defaultChain.network : undefined)

  return {
    networkName,
  }
}

export function useActiveChainId() {
  const { networkName } = useActiveNetwork()

  return chains.find((c) => c.name.toLowerCase() === networkName?.toLowerCase())?.id
}
