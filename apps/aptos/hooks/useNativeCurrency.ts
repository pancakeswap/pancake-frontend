import { AptosCoin } from '@pancakeswap/aptos-swap-sdk'
import { defaultChain } from '@pancakeswap/awgmi'
import { useMemo } from 'react'
import { useActiveChainId } from './useNetwork'

const useNativeCurrency = () => {
  const chainId = useActiveChainId()

  return useMemo(() => {
    return AptosCoin.onChain(chainId || defaultChain.id)
  }, [chainId])
}

export default useNativeCurrency
