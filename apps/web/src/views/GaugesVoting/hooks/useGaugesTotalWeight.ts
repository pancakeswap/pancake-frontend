import { useQuery } from '@tanstack/react-query'
import { useGaugesVotingContract } from 'hooks/useContract'

export const useGaugesTotalWeight = () => {
  const gaugesVotingContract = useGaugesVotingContract()

  const { data } = useQuery(['gaugesTotalWeight', gaugesVotingContract.address], async () => {
    return gaugesVotingContract.read.getTotalWeight([true])
  })

  return data ?? 0n
}
