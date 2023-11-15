import { useQuery } from '@tanstack/react-query'
import { useRevenueSharingPoolForCakeContract } from 'hooks/useContract'

export const useGaugeEpochEnd = (): number => {
  const revenueSharingPoolContract = useRevenueSharingPoolForCakeContract()

  const { data } = useQuery(
    ['gaugeEpochEnd', revenueSharingPoolContract.address],
    async () => {
      const amount = (await revenueSharingPoolContract.read.weekCursor()) ?? 0n

      return Number(amount)
    },
    {
      keepPreviousData: true,
    },
  )

  return data ?? 0
}
