import { useQuery } from '@tanstack/react-query'
import { useRevenueSharingCakePoolContract, useRevenueSharingVeCakeContract } from './useContract'

const INITIAL_INCENTIVE = 0n

export const useCakeDistributed = (): bigint => {
  const cakePool = useRevenueSharingCakePoolContract()
  const veCake = useRevenueSharingVeCakeContract()

  const { data: fromCakePool = 0n } = useQuery(
    ['cakeDistributed/cakePool', cakePool.address, cakePool.chain?.id],
    async () => {
      try {
        const amount = (await cakePool.read.totalDistributed()) ?? 0n
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
  const { data: fromVeCake = 0n } = useQuery(
    ['cakeDistributed/veCake', veCake.address, veCake.chain?.id],
    async () => {
      try {
        const amount = (await veCake.read.totalDistributed()) ?? 0n
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

  return INITIAL_INCENTIVE + fromCakePool + fromVeCake
}
