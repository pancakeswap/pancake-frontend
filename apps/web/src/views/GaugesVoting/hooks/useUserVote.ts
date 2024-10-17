import { Gauge } from '@pancakeswap/gauges'
import { usePreviousValue } from '@pancakeswap/hooks'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useGaugesVotingContract } from 'hooks/useContract'
import { useEffect, useMemo } from 'react'
import { publicClient as getPublicClient } from 'utils/viem'
import { isAddressEqual } from 'utils'
import { Address, Hex, zeroAddress } from 'viem'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'
import { useVeCakeUserInfo } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { CakePoolType } from 'views/CakeStaking/types'
import { useCurrentEpochStart, useNextEpochStart } from './useEpochTime'

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

export const useUserVote = (gauge: Gauge | undefined, submitted?: boolean, useProxyPool: boolean = true) => {
  const { account, chainId } = useAccountActiveChain()
  const contract = useGaugesVotingContract()
  const { data: userInfo } = useVeCakeUserInfo()
  const currentTimestamp = useCurrentBlockTimestamp()
  const currentEpochStart = useCurrentEpochStart()
  const nextEpochStart = useNextEpochStart()
  const publicClient = useMemo(() => getPublicClient({ chainId }), [chainId])
  const prevSubmittedStatus = usePreviousValue(submitted)

  const { data, refetch } = useQuery({
    queryKey: ['/vecake/userVoteSlopes', contract.address, gauge?.hash, account],

    queryFn: async (): Promise<VotedSlope> => {
      const delegated = userInfo?.cakePoolType === CakePoolType.DELEGATED
      const hasProxy =
        useProxyPool && userInfo?.cakePoolProxy && !isAddressEqual(userInfo?.cakePoolProxy, zeroAddress) && !delegated
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
        if (!proxyEnd) {
          return {
            hash: gauge?.hash as Hex,
            nativeSlope,
            nativePower,
            nativeEnd,
            nativeLastVoteTime,
            nativeVoteLocked,
            slope: nativeSlope,
            power: nativePower,
            end: nativeEnd,
            lastVoteTime: nativeLastVoteTime,
            voteLocked: nativeVoteLocked,
          }
        }
        let ignoredSlope = 0n
        let ignoredPower = 0n
        let ignoredSide: 'native' | 'proxy' | undefined
        const nativeExpired = nativeEnd > 0n && nativeEnd < currentEpochStart
        const proxyExpired = proxyEnd > 0n && proxyEnd < currentEpochStart
        const nativeWillExpire = nativeEnd > 0n && nativeEnd > currentEpochStart && nativeEnd < nextEpochStart
        const proxyWillExpire = proxyEnd > 0n && proxyEnd > currentEpochStart && proxyEnd < nextEpochStart

        // when native slope will expire before current epochEnd
        // use proxy slope only
        if ((nativeWillExpire && !proxyWillExpire) || (nativeExpired && !proxyExpired)) {
          ignoredSlope = nativeSlope
          ignoredPower = nativePower
          ignoredSide = 'native'
          nativeSlope = 0n
          nativePower = 0n
        }
        // when proxy slope will expire before current epochEnd
        // use native slope only
        if ((proxyWillExpire && !nativeWillExpire) || (proxyExpired && !nativeExpired)) {
          ignoredSlope = proxySlope
          ignoredPower = proxyPower
          ignoredSide = 'proxy'
          proxySlope = 0n
          proxyPower = 0n
        }

        // when both slopes will expire before current epochEnd
        // use max of both slopes
        if (nativeWillExpire && proxyWillExpire) {
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
      const response = publicClient
        ? await publicClient.multicall({
            contracts: calls,
            allowFailure: false,
          })
        : []
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

    enabled: !!account && publicClient && Boolean(gauge?.hash),
  })

  useEffect(() => {
    if (submitted && !prevSubmittedStatus && typeof prevSubmittedStatus !== 'undefined') {
      refetch()
    }
  }, [submitted, prevSubmittedStatus, refetch])

  return data
}
