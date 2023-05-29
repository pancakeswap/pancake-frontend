import { ChainId } from '@pancakeswap/sdk'
import { ChainId as ChainIdType, GelatoLimitOrders } from '@gelatonetwork/limit-orders-lib'
import { GELATO_HANDLER } from 'config/constants/exchange'
import useSWRImmutable from 'swr/immutable'
import { useAccount } from 'wagmi'
import { useActiveChainId } from '../useActiveChainId'

const useGelatoLimitOrdersLib = (): GelatoLimitOrders | undefined => {
  const { chainId } = useActiveChainId()
  const { connector } = useAccount()

  const { data: gelatorLimitOrder } = useSWRImmutable(
    chainId === ChainId.BSC && connector && 'gelatoLimitOrder',
    async () => {
      const Web3Provider = await import('ethers').then(({ providers }) => {
        return providers.Web3Provider
      })
      return connector.getProvider().then((provider) => {
        const signer = new Web3Provider(provider).getSigner()
        const lib = new GelatoLimitOrders(chainId as ChainIdType, signer, GELATO_HANDLER, false)
        return lib
      })
    },
  )

  return gelatorLimitOrder
}

export default useGelatoLimitOrdersLib
