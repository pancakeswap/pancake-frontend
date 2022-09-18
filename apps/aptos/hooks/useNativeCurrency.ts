import { AptosCoin } from '@pancakeswap/aptos-swap-sdk'
import { useMemo } from 'react'
import { useActiveChainId } from './useNetwork'

const useNativeCurrency = () => {
  const chainId = useActiveChainId()
  return useMemo(() => {
    return AptosCoin.onChain(chainId)
  }, [chainId])
}

export default useNativeCurrency
