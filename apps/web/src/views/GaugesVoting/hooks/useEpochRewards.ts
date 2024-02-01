import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { WEEK } from 'config/constants/veCake'
import { useRevenueSharingVeCakeContract } from 'hooks/useContract'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'

export const useEpochRewards = (): number => {
  const revenueSharingPoolContract = useRevenueSharingVeCakeContract()
  const currentTimestamp = useCurrentBlockTimestamp()

  const { data } = useQuery({
    queryKey: ['epochRewards', revenueSharingPoolContract.address],

    queryFn: async () => {
      const week = Math.floor(currentTimestamp / WEEK) * WEEK
      const amount = (await revenueSharingPoolContract.read.tokensPerWeek([BigInt(week)])) ?? 0n
      return Number(amount)
    },

    placeholderData: keepPreviousData,
  })

  return data ?? 0
}
