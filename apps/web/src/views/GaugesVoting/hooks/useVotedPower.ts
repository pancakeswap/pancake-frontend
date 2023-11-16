import { useGaugesVotingContract } from 'hooks/useContract'
import { useAccount, useQuery } from 'wagmi'

export const useVotedPower = () => {
  const { address: account } = useAccount()
  const contract = useGaugesVotingContract()
  const { data } = useQuery(
    ['/vecake/vote-power', contract.address, account],
    async (): Promise<number> => {
      const power = (await contract.read.voteUserPower([account!])) ?? 0n

      return Number(power)
    },
    {
      enabled: !!account,
    },
  )
  return data
}
