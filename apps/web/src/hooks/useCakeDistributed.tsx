import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useRevenueSharingCakePoolContract, useRevenueSharingVeCakeContract } from './useContract'

const INITIAL_INCENTIVE = 0n

export const useCakeDistributed = (): bigint => {
  const cakePool = useRevenueSharingCakePoolContract()
  const veCake = useRevenueSharingVeCakeContract()

  const { data: fromCakePool = 0n } = useQuery({
    queryKey: ['cakeDistributed/cakePool', cakePool.address, cakePool.chain?.id],

    queryFn: async () => {
      try {
        const amount = (await cakePool.read.totalDistributed()) ?? 0n
        return amount
      } catch (error) {
        console.warn(error)
        return 0n
      }
    },

    placeholderData: keepPreviousData,
  })
  const { data: fromVeCake = 0n } = useQuery({
    queryKey: ['cakeDistributed/veCake', veCake.address, veCake.chain?.id],

    queryFn: async () => {
      try {
        const amount = (await veCake.read.totalDistributed()) ?? 0n
        return amount
      } catch (error) {
        console.warn(error)
        return 0n
      }
    },

    placeholderData: keepPreviousData,
  })

  return INITIAL_INCENTIVE + fromCakePool + fromVeCake
}
