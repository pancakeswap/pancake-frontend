import { useMemo } from 'react'
import { ChainId, GelatoLimitOrders } from '@gelatonetwork/limit-orders-lib'
import useActiveWeb3React, { useProviderOrSigner } from 'hooks/useActiveWeb3React'
import { GELATO_HANDLER } from 'config/constants/exchange'

const useGelatoLimitOrdersLib = (): GelatoLimitOrders | undefined => {
  const { chainId } = useActiveWeb3React()
  const providerOrSigner = useProviderOrSigner()

  return useMemo(() => {
    if (!chainId || !providerOrSigner) {
      console.error('Could not instantiate GelatoLimitOrders: missing chainId or library')
      return undefined
    }
    try {
      return new GelatoLimitOrders(chainId as ChainId, providerOrSigner, GELATO_HANDLER, false)
    } catch (error: any) {
      console.error(`Could not instantiate GelatoLimitOrders: ${error.message}`)
      return undefined
    }
  }, [chainId, providerOrSigner])
}

export default useGelatoLimitOrdersLib
