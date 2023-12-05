import { Gauge } from '@pancakeswap/gauges'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useGaugesVotingContract } from 'hooks/useContract'
import { Address, Hex, isAddressEqual, zeroAddress } from 'viem'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { useVeCakeUserInfo } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { usePublicClient } from 'wagmi'

export type VotedSlope = {
  hash: string

  nativeSlope: bigint
  nativePower: bigint
  nativeEnd: bigint
  nativeLastVoteTime: bigint
  nativeVoteLocked: boolean

  proxySlope?: bigint
  proxyPower?: bigint
  proxyEnd?: bigint
  proxyLastVoteTime?: bigint
  proxyVoteLocked?: boolean

  slope: bigint
  power: bigint
  end: bigint
  lastVoteTime: bigint
  voteLocked: boolean
}

const max = (a: bigint, b: bigint) => (a > b ? a : b)
const sum = (a: bigint, b: bigint) => a + b

export const useUserVote = (gauge?: Gauge, useProxyPool: boolean = true) => {
  const { account, chainId } = useAccountActiveChain()
  const publicClient = usePublicClient({ chainId })
  const contract = useGaugesVotingContract()
  const { data: userInfo } = useVeCakeUserInfo()
  const currentTimestamp = useCurrentBlockTimestamp()
  // const nextEpochStart = useNextEpochStart()

  const { data } = useQuery(
    ['/vecake/userVoteSlopes', contract.address, gauge?.hash, account],
    async (): Promise<VotedSlope> => {
      const hasProxy = useProxyPool && userInfo?.cakePoolProxy && !isAddressEqual(userInfo?.cakePoolProxy, zeroAddress)
      const calls = [
        {
          ...contract,
          functionName: 'voteUserSlopes',
          args: [account!, gauge?.hash as Hex],
        } as const,
        {
          ...contract,
          functionName: 'lastUserVote',
          args: [account!, gauge?.hash as Hex],
        },
      ] as const
      const callsWithProxy = [
        {
          ...contract,
          functionName: 'voteUserSlopes',
          args: [userInfo?.cakePoolProxy as Address, gauge?.hash as Hex],
        },
        {
          ...contract,
          functionName: 'lastUserVote',
          args: [userInfo?.cakePoolProxy as Address, gauge?.hash as Hex],
        },
        ...calls,
      ] as const
      if (hasProxy) {
        const response = await publicClient.multicall({
          contracts: callsWithProxy,
          allowFailure: false,
        })
        const [
          [proxySlope, proxyPower, proxyEnd],
          proxyLastVoteTime,
          [nativeSlope, nativePower, nativeEnd],
          nativeLastVoteTime,
        ] = response
        const proxyVoteLocked = dayjs
          .unix(Number(proxyLastVoteTime))
          .add(10, 'day')
          .isAfter(dayjs.unix(currentTimestamp))
        const nativeVoteLocked = dayjs
          .unix(Number(nativeLastVoteTime))
          .add(10, 'day')
          .isAfter(dayjs.unix(currentTimestamp))
        return {
          hash: gauge?.hash as Hex,
          proxyPower,
          proxySlope,
          proxyEnd,
          proxyLastVoteTime,
          proxyVoteLocked,
          nativeSlope,
          nativePower,
          nativeEnd,
          nativeLastVoteTime,
          nativeVoteLocked,

          power: max(nativePower, proxyPower),
          slope: sum(nativeSlope, nativeSlope),
          end: max(nativeEnd, nativeEnd),
          voteLocked: proxyVoteLocked || nativeVoteLocked,
          lastVoteTime: proxyLastVoteTime < nativeLastVoteTime ? nativeLastVoteTime : proxyLastVoteTime,
        }
      }
      const response = await publicClient.multicall({
        contracts: calls,
        allowFailure: false,
      })
      const [[nativeSlope, nativePower, nativeEnd], lastVoteTime] = response
      const voteLocked = dayjs.unix(Number(lastVoteTime)).add(10, 'day').isAfter(dayjs.unix(currentTimestamp))

      return {
        hash: gauge?.hash as Hex,
        nativeSlope,
        nativePower,
        nativeEnd,
        nativeLastVoteTime: lastVoteTime,
        nativeVoteLocked: voteLocked,

        slope: nativeSlope,
        power: nativePower,
        end: nativeEnd,
        lastVoteTime,
        voteLocked,
      }
    },
    {
      enabled: !!account && Boolean(gauge?.hash),
    },
  )
  return data
}
