import { useQuery } from '@tanstack/react-query'
import { useGaugesVotingContract } from 'hooks/useContract'

export const useGaugesVotingCount = (): bigint | undefined => {
  const gaugesVotingContract = useGaugesVotingContract()

  const { data } = useQuery(
    ['gaugesVotingCount'],
    async () => {
      try {
        const count = (await gaugesVotingContract.read.gaugeCount()) ?? 0n
        return count
      } catch (error) {
        console.warn(error)
        return 0n
      }
    },
    {
      keepPreviousData: true,
    },
  )

  return data
}
