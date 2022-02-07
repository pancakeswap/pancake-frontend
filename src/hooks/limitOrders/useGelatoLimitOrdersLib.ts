import { useMemo } from 'react'
import { ChainId, GelatoLimitOrders } from '@gelatonetwork/limit-orders-lib'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const useGelatoLimitOrdersLib = (): GelatoLimitOrders | undefined => {
  const { chainId, library } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId || !library) {
      console.error('Could not instantiate GelatoLimitOrders: missing chainId or library')
      return undefined
    }
    try {
      return new GelatoLimitOrders(chainId as ChainId, library?.getSigner(), 'pancakeswap', false)
    } catch (error: any) {
      console.error(`Could not instantiate GelatoLimitOrders: ${error.message}`)
      return undefined
    }
  }, [chainId, library])
}

export default useGelatoLimitOrdersLib
