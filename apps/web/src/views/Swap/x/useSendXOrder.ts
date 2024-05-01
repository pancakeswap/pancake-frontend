import { ExclusiveDutchOrder, type ExclusiveDutchOrderInfo } from '@pancakeswap/pcsx-sdk'
import { useMutation } from '@tanstack/react-query'
import { logger } from 'utils/datadog'
import { useSignTypedData } from 'wagmi'
import { submitXOrder } from './api'

export function useSendXOrder() {
  const { signTypedDataAsync } = useSignTypedData()

  return useMutation({
    onError(error, variables) {
      logger.error('useSendXOrder', {
        error,
        context: variables,
      })
    },
    mutationFn: async (options: { chainId: number; orderInfo: ExclusiveDutchOrderInfo }) => {
      const { chainId, orderInfo } = options

      const order = new ExclusiveDutchOrder(orderInfo, chainId as number)

      const permitData = order.permitData()
      const signature = await signTypedDataAsync({
        domain: {
          name: permitData.domain.name,
          version: permitData.domain.version,
          verifyingContract: permitData.domain.verifyingContract,
          chainId,
        },
        types: permitData.types,
        primaryType: 'PermitWitnessTransferFrom',
        message: permitData.values,
      })

      return submitXOrder({
        encodedOrder: order.encode(),
        chainId,
        signature,
      })
    },
  })
}
