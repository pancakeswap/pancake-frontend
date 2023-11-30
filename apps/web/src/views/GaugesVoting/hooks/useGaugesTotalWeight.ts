import { useQuery } from '@tanstack/react-query'
import { useGaugesVotingContract } from 'hooks/useContract'
import { useAtomValue } from 'jotai'
import { gaugesInCapAtom } from 'state/vecake/atoms'

export const useGaugesTotalWeight = () => {
  const gaugesVotingContract = useGaugesVotingContract()
  const inCap = useAtomValue(gaugesInCapAtom)

  const { data } = useQuery(['gaugesTotalWeight', gaugesVotingContract.address, inCap], async () => {
    return gaugesVotingContract.read.getTotalWeight([inCap])
  })

  return data ?? 0n
}
