import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useGaugesVotingContract } from 'hooks/useContract'
import { Hex } from 'viem'
import { usePublicClient } from 'wagmi'
import { GaugeVoting } from './useGaugesVoting'

export type VotedSlope = {
  slope: number
  power: number
  end: number
  lastVoteTime: number
  voteLocked: boolean
}

export const useUserVote = (gauge?: GaugeVoting) => {
  const contract = useGaugesVotingContract()
  const { account, chainId } = useAccountActiveChain()
  const publicClient = usePublicClient({ chainId })

  const { data } = useQuery(
    ['/vecake/userVoteSlopes', contract.address, gauge?.hash, account],
    async (): Promise<VotedSlope> => {
      const response = await publicClient.multicall({
        contracts: [
          {
            ...contract,
            functionName: 'voteUserSlopes',
            args: [account!, gauge?.hash as Hex],
          },
          {
            ...contract,
            functionName: 'lastUserVote',
            args: [account!, gauge?.hash as Hex],
          },
        ],
        allowFailure: false,
      })
      const [[slope, power, end], lastVoteTime] = response

      return {
        slope: Number(slope),
        power: Number(power),
        end: Number(end),
        lastVoteTime: Number(lastVoteTime),
        voteLocked: dayjs.unix(Number(lastVoteTime)).add(7, 'day').isBefore(dayjs()),
      }
    },
    {
      enabled: !!account && Boolean(gauge?.hash),
    },
  )
  return data
}
