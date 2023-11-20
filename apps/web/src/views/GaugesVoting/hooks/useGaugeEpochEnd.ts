import { useQuery } from '@tanstack/react-query'
import { WEEK } from 'config/constants/veCake'
import { useRevenueSharingPoolForCakeContract } from 'hooks/useContract'

export const useGaugeEpochEnd = (): number => {
  const revenueSharingPoolContract = useRevenueSharingPoolForCakeContract()

  const { data } = useQuery(
    ['gaugeEpochEnd', revenueSharingPoolContract.address],
    async () => {
      const amount = (await revenueSharingPoolContract.read.weekCursor()) ?? 0n

      return Number(amount) + WEEK
    },
    {
      keepPreviousData: true,
    },
  )

  return data ?? 0
}
