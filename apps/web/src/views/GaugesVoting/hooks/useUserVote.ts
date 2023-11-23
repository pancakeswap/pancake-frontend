import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useGaugesVotingContract } from 'hooks/useContract'
import { Hex } from 'viem'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { usePublicClient } from 'wagmi'
import { useNextEpochStart } from './useEpochTime'
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
  const currentTimestamp = useCurrentBlockTimestamp()
  const nextEpochStart = useNextEpochStart()

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
        voteLocked:
          Number(end) > nextEpochStart &&
          dayjs.unix(Number(lastVoteTime)).add(10, 'day').isAfter(dayjs.unix(currentTimestamp)),
      }
    },
    {
      enabled: !!account && Boolean(gauge?.hash),
    },
  )
  return data
}
