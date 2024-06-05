import { useRouter } from 'next/router'
import { useMemo } from 'react'
import type { components } from './schema'

export const useExplorerChainNameByQuery = (): components['schemas']['ChainName'] | undefined => {
  const { query, isReady } = useRouter()
  const chainName = useMemo(() => {
    switch (query?.chainName) {
      case 'eth':
        return 'ethereum'
      case 'polygon-zkevm':
        return 'polygon-zkevm'
      case 'zksync':
        return 'zksync'
      case 'arb':
        return 'arbitrum'
      case 'linea':
        return 'linea'
      case 'base':
        return 'base'
      case 'opbnb':
        return 'opbnb'
      default:
        return 'bsc'
    }
  }, [query])

  return isReady ? chainName : undefined
}
