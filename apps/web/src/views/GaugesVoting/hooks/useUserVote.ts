import { useQuery } from '@tanstack/react-query'
import { useGaugesVotingContract } from 'hooks/useContract'
import { Hex } from 'viem'
import { useAccount } from 'wagmi'
import { GaugeVoting } from './useGaugesVoting'

export type VotedSlope = {
  slope: number
  power: number
  end: number
}

export const useUserVote = (gauge?: GaugeVoting) => {
  const { address: account } = useAccount()
  const contract = useGaugesVotingContract()
  const { data } = useQuery(
    ['/vecake/userVoteSlopes', contract.address, gauge?.hash, account],
    async (): Promise<VotedSlope> => {
      const [slope, power, end] = (await contract.read.voteUserSlopes([account!, gauge?.hash as Hex])) ?? 0n

      return {
        slope: Number(slope),
        power: Number(power),
        end: Number(end),
      }
    },
    {
      enabled: !!account && Boolean(gauge?.hash),
    },
  )
  return data
}
