import { useQuery } from '@tanstack/react-query'
import { gaugesVotingABI } from 'config/abi/gaugesVoting'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useGaugesVotingContract } from 'hooks/useContract'
import { ContractFunctionConfig, ContractFunctionResult, MulticallContracts } from 'viem'
import { usePublicClient } from 'wagmi'
import { GaugeInfo, useGauges } from './useGauges'

export type GaugeVoting = GaugeInfo & {
  weight: number
}

export const useGaugesVoting = () => {
  const gauges = useGauges()
  const gaugesVotingContract = useGaugesVotingContract()
  const { chainId } = useActiveChainId()
  const publicClient = usePublicClient({ chainId })

  const { data } = useQuery(['gaugesVoting', gaugesVotingContract.address], async (): Promise<GaugeVoting[]> => {
    if (!gauges || gauges.length === 0) return []

    const contracts: MulticallContracts<ContractFunctionConfig<typeof gaugesVotingABI, 'getGaugeWeight'>[]> =
      gauges.map((gauge) => {
        return {
          ...gaugesVotingContract,
          functionName: 'getGaugeWeight',
          args: [gauge.pairAddress, BigInt(gauge.chainId), true],
        } as const
      })

    const response = (await publicClient.multicall({
      contracts,
      allowFailure: false,
    })) as ContractFunctionResult<typeof gaugesVotingABI, 'getGaugeWeight'>[]

    return gauges.map((gauge, index) => ({
      ...gauge,
      weight: Number(response[index] ?? 0),
    }))
  })

  return data
}
