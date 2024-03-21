import { ChainId as ChainIdType, GelatoLimitOrders } from '@gelatonetwork/limit-orders-lib'
import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { GELATO_HANDLER } from 'config/constants/exchange'
import { useAccount } from 'wagmi'
import { useActiveChainId } from '../useActiveChainId'

const useGelatoLimitOrdersLib = (): GelatoLimitOrders | undefined => {
  const { chainId } = useActiveChainId()
  const { connector } = useAccount()

  const { data: gelatoLimitOrder } = useQuery({
    queryKey: ['limitOrders', 'gelatoLimitOrder'],

    queryFn: async () => {
      if (!connector) {
        throw new Error('No connector')
      }

      const Web3Provider = await import('ethers').then(({ providers }) => {
        return providers.Web3Provider
      })
      return connector.getProvider().then((provider: any) => {
        const signer = new Web3Provider(provider).getSigner()
        const lib = new GelatoLimitOrders(chainId as ChainIdType, signer, GELATO_HANDLER, false)
        return lib
      })
    },

    enabled: Boolean(chainId === ChainId.BSC && connector),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return gelatoLimitOrder
}

export default useGelatoLimitOrdersLib
