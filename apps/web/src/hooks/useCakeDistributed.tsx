import { useQuery } from '@tanstack/react-query'
import { useRevenueSharingPoolForCakeContract } from './useContract'

export const useCakeDistributed = (): bigint => {
  const revenueSharingPoolContract = useRevenueSharingPoolForCakeContract()

  const { data } = useQuery(
    ['cakeDistributed', revenueSharingPoolContract.address, revenueSharingPoolContract.chain?.id],
    async () => {
      try {
        const amount = (await revenueSharingPoolContract.read.totalDistributed()) ?? 0n
        return amount
      } catch (error) {
        console.warn(error)
        return 0n
      }
    },
    {
      keepPreviousData: true,
    },
  )

  return data ?? 0n
}
