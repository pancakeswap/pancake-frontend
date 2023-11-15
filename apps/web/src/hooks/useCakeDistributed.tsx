import { useQuery } from '@tanstack/react-query'
import { useRevenueSharingPoolForCakeContract } from './useContract'

export const useCakeDistributed = (): bigint => {
  const revenueSharingPoolContract = useRevenueSharingPoolForCakeContract()

  const { data } = useQuery(
    ['cakeDistributed', revenueSharingPoolContract.address],
    async () => {
      const amount = (await revenueSharingPoolContract.read.totalDistributed()) ?? 0n
      return amount
    },
    {
      keepPreviousData: true,
    },
  )

  return data ?? 0n
}
