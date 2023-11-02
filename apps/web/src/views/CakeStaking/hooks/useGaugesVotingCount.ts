import { useQuery } from '@tanstack/react-query'
import { useGaugesVotingContract } from 'hooks/useContract'

export const useGaugesVotingCount = (): bigint | undefined => {
  const gaugesVotingContract = useGaugesVotingContract()

  const { data } = useQuery(
    ['gaugesVotingCount'],
    async () => {
      const count = (await gaugesVotingContract.read.gaugeCount()) ?? 0n
      return count
    },
    {
      keepPreviousData: true,
    },
  )

  return data
}
