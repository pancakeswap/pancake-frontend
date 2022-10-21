import { useAccount, useNetwork } from '@pancakeswap/awgmi'
import { equalsIgnoreCase } from '@pancakeswap/utils/equalsIgnoreCase'
import { chains, defaultChain } from 'config/chains'
import { atom, useAtomValue } from 'jotai'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { isChainSupported } from 'utils'

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
  const queryNetwork = useAtomValue(queryNetworkAtom)
  const { query } = useRouter()

  const network = query.network || queryNetwork

  if (typeof network === 'string' && isChainSupported(network)) {
    return network
  }

  return undefined
}

export function useActiveNetwork() {
  const localNetworkName = useLocalNetwork()
  const { chain } = useNetwork()
  const { isConnected } = useAccount()
  const queryNetwork = useAtomValue(queryNetworkAtom)
  const isWrongNetwork = (isConnected && !chain) || chain?.unsupported

  // until wallet support switch network, we follow wallet chain instead of routing
  return useMemo(() => {
    let networkName: string | undefined

    if (queryNetwork === '') {
      return {
        networkName,
      }
    }

    networkName = chain?.network ?? localNetworkName

    return {
      networkName,
      isWrongNetwork,
    }
  }, [queryNetwork, chain?.network, localNetworkName, isWrongNetwork])
}

export function useActiveChainId() {
  const { networkName } = useActiveNetwork()

  return useMemo(
    () => chains.find((c) => equalsIgnoreCase(c.network, networkName))?.id ?? defaultChain.id,
    [networkName],
  )
}
