import { useQuery } from '@tanstack/react-query'
import { gaugesVotingABI } from 'config/abi/gaugesVoting'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useGaugesVotingContract } from 'hooks/useContract'
import { useMemo } from 'react'
import { ContractFunctionConfig, ContractFunctionResult, Hex, MulticallContracts } from 'viem'
import { useVeCakeUserInfo } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { usePublicClient } from 'wagmi'
import { useGaugesVoting } from './useGaugesVoting'

export type VoteSlope = {
  hash: string
  power: number
  slope: number
  end: number
}

export const useUserVoteSlopes = () => {
  const gauges = useGaugesVoting()
  const { data: userInfo } = useVeCakeUserInfo()
  const gaugesVotingContract = useGaugesVotingContract()
  const { account, chainId } = useAccountActiveChain()
  const publicClient = usePublicClient({ chainId })

  const { data, refetch } = useQuery(
    ['/vecake/user-vote-slopes', gaugesVotingContract.address, account, gauges?.length, userInfo?.cakePoolProxy],
    async (): Promise<VoteSlope[]> => {
      if (!gauges || gauges.length === 0 || !account) return []

      const contracts: MulticallContracts<ContractFunctionConfig<typeof gaugesVotingABI, 'voteUserSlopes'>[]> =
        gauges.map((gauge) => {
          return {
            ...gaugesVotingContract,
            functionName: 'voteUserSlopes',
            args: [account, gauge.hash as Hex],
          } as const
        })

      if (userInfo?.cakePoolProxy) {
        gauges.forEach((gauge) => {
          contracts.push({
            ...gaugesVotingContract,
            functionName: 'voteUserSlopes',
            args: [userInfo.cakePoolProxy, gauge.hash as Hex],
          } as const)
        })
      }

      const response = (await publicClient.multicall({
        contracts,
        allowFailure: false,
      })) as ContractFunctionResult<typeof gaugesVotingABI, 'voteUserSlopes'>[]

      return response.map(([slope, power, end], index) => ({
        hash: gauges[index % gauges.length].hash,
        power: Number(slope),
        slope: Number(power),
        end: Number(end),
      }))
    },
    {
      enabled: Boolean(gauges && gauges.length) && account && account !== '0x',
    },
  )

  return {
    data: data ?? [],
    refetch,
  }
}

export const useUserVoteGauges = () => {
  const gauges = useGaugesVoting()
  const { data: slopes, refetch } = useUserVoteSlopes()

  const data = useMemo(() => {
    if (!gauges || !slopes) return []

    return gauges.filter((gauge) => {
      const slope = slopes.find((s) => s.hash === gauge.hash)

      return slope && slope.power > 0
    })
  }, [slopes, gauges])

  return {
    data,
    refetch,
  }
}
