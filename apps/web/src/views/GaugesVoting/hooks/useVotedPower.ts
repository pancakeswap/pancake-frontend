import { useQuery } from '@tanstack/react-query'
import { useGaugesVotingContract } from 'hooks/useContract'
import { useAccount } from 'wagmi'

export const useVotedPower = () => {
  const { address: account } = useAccount()
  const contract = useGaugesVotingContract()
  const { data } = useQuery({
    queryKey: ['/vecake/vote-power', contract.address, account],

    queryFn: async (): Promise<number> => {
      const power = (await contract.read.voteUserPower([account!])) ?? 0n

      return Number(power)
    },

    enabled: !!account,
  })
  return data
}
