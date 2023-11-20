import { useQuery } from '@tanstack/react-query'
import { WEEK } from 'config/constants/veCake'
import { useRevenueSharingPoolForCakeContract } from 'hooks/useContract'

export const useEpochRewards = (): number => {
  const revenueSharingPoolContract = useRevenueSharingPoolForCakeContract()

  const { data } = useQuery(
    ['epochRewards', revenueSharingPoolContract.address],
    async () => {
      const week = Math.floor(new Date().getTime() / 1000 / WEEK) * WEEK
      const amount = (await revenueSharingPoolContract.read.tokensPerWeek([BigInt(week)])) ?? 0n
      return Number(amount)
    },
    {
      keepPreviousData: true,
    },
  )

  return data ?? 0
}
