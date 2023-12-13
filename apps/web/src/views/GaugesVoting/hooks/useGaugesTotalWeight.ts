import { useQuery } from '@tanstack/react-query'
import { useCalcGaugesVotingContract } from 'hooks/useContract'

export const useGaugesTotalWeight = () => {
  const gaugesVotingContract = useCalcGaugesVotingContract()

  const { data } = useQuery(['gaugesTotalWeight', gaugesVotingContract.address], async () => {
    return gaugesVotingContract.read.getTotalWeight([true])
  })

  return data ?? 0n
}
