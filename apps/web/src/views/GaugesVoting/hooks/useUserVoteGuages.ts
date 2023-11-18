import { useQuery } from '@tanstack/react-query'
import { gaugesVotingABI } from 'config/abi/gaugesVoting'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useGaugesVotingContract } from 'hooks/useContract'
import { ContractFunctionConfig, ContractFunctionResult, Hex, MulticallContracts } from 'viem'
import { usePublicClient } from 'wagmi'
import { GaugeVoting, useGaugesVoting } from './useGaugesVoting'

export const useUserVoteGauges = () => {
  const gauges = useGaugesVoting()
  const gaugesVotingContract = useGaugesVotingContract()
  const { account, chainId } = useAccountActiveChain()
  const publicClient = usePublicClient({ chainId })

  const { data, refetch } = useQuery(
    ['/vecake/user-vote-gauges', gaugesVotingContract.address, account, gauges?.map((gauge) => gauge.hash)],
    async (): Promise<GaugeVoting[]> => {
      if (!gauges || gauges.length === 0 || !account) return []

      const contracts: MulticallContracts<ContractFunctionConfig<typeof gaugesVotingABI, 'voteUserSlopes'>[]> =
        gauges.map((gauge) => {
          return {
            ...gaugesVotingContract,
            functionName: 'voteUserSlopes',
            args: [account, gauge.hash as Hex],
          } as const
        })

      const response = (await publicClient.multicall({
        contracts,
        allowFailure: false,
      })) as ContractFunctionResult<typeof gaugesVotingABI, 'voteUserSlopes'>[]

      return gauges.filter((gauge, index) => {
        const slope = response[index] ?? [0n, 0n, 0n]
        const power = slope[1]

        if (power > 0n) return true
        return false
      })
    },
  )

  return {
    data: data ?? [],
    refetch,
  }
}
