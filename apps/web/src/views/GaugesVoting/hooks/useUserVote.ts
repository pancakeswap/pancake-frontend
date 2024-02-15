import { Gauge } from '@pancakeswap/gauges'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useGaugesVotingContract } from 'hooks/useContract'
import { Address, Hex, isAddressEqual, zeroAddress } from 'viem'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { useVeCakeUserInfo } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { usePublicClient } from 'wagmi'
import { useNextEpochStart } from './useEpochTime'

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
  ignoredSide?: 'native' | 'proxy'
  ignoredSlope?: bigint
  ignoredPower?: bigint
}

const max = (a: bigint, b: bigint) => (a > b ? a : b)
const sum = (a: bigint, b: bigint) => a + b

export const useUserVote = (gauge?: Gauge, useProxyPool: boolean = true) => {
  const { account, chainId } = useAccountActiveChain()
  const publicClient = usePublicClient({ chainId })
  const contract = useGaugesVotingContract()
  const { data: userInfo } = useVeCakeUserInfo()
  const currentTimestamp = useCurrentBlockTimestamp()
  const nextEpochStart = useNextEpochStart()

  const { data } = useQuery({
    queryKey: ['/vecake/userVoteSlopes', contract.address, gauge?.hash, account],

    queryFn: async (): Promise<VotedSlope> => {
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
          [_proxySlope, _proxyPower, proxyEnd],
          proxyLastVoteTime,
          [_nativeSlope, _nativePower, nativeEnd],
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
        let [nativeSlope, nativePower, proxySlope, proxyPower] = [_nativeSlope, _nativePower, _proxySlope, _proxyPower]
        let ignoredSlope = 0n
        let ignoredPower = 0n
        let ignoredSide: 'native' | 'proxy' | undefined
        const nativeExpired = nativeEnd > 0n && nativeEnd < nextEpochStart
        const proxyExpired = proxyEnd > 0n && proxyEnd < nextEpochStart

        // when native slope will expire before current epochEnd
        // use proxy slope only
        if (nativeExpired && !proxyExpired) {
          ignoredSlope = nativeSlope
          ignoredPower = nativePower
          ignoredSide = 'native'
          nativeSlope = 0n
          nativePower = 0n
        }
        // when proxy slope will expire before current epochEnd
        // use native slope only
        if (proxyExpired && !nativeExpired) {
          ignoredSlope = proxySlope
          ignoredPower = proxyPower
          ignoredSide = 'proxy'
          proxySlope = 0n
          proxyPower = 0n
        }

        // when both slopes will expire before current epochEnd
        // use max of both slopes
        if (nativeExpired && proxyExpired) {
          const nativeWeight = _nativeSlope * (nativeEnd - BigInt(currentTimestamp))
          const proxyWeight = _proxySlope * (proxyEnd - BigInt(currentTimestamp))
          if (nativeWeight > proxyWeight) {
            ignoredPower = proxyPower
            ignoredSlope = proxySlope
            ignoredSide = 'proxy'
            proxySlope = 0n
            proxyPower = 0n
          } else {
            ignoredPower = nativePower
            ignoredSlope = nativeSlope
            ignoredSide = 'native'
            nativeSlope = 0n
            nativePower = 0n
          }
        }

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
          ignoredPower,
          ignoredSlope,
          ignoredSide,
        }
      }
      const response = (await publicClient.multicall({
        contracts: calls,
        allowFailure: false,
      })) as [[bigint, bigint, bigint], bigint]
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

    enabled: !!account && Boolean(gauge?.hash),
  })
  return data
}
