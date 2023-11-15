import { useQuery } from '@tanstack/react-query'
import { gaugesVotingABI } from 'config/abi/gaugesVoting'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useGaugesVotingContract } from 'hooks/useContract'
import { Address, ContractFunctionConfig, ContractFunctionResult, MulticallContracts } from 'viem'
import { useGaugesVotingCount } from 'views/CakeStaking/hooks/useGaugesVotingCount'
import { usePublicClient } from 'wagmi'

export type GaugeInfo = {
  pairAddress: Address
  masterChef: Address
  pid: bigint
  chainId: bigint
  boostMultiplier: bigint
  maxVoteCap: bigint
}

// @fixme: GraphQL query Gauge type ID has wrong type
// type GaugeQueryResponse = {
//   gauges: {
//     id: string
//     pid: bigint
//     chainId: bigint
//     boostMultiplier: bigint
//     maxVoteCap: bigint
//   }[]
// }

// const queryAllGauges = async () => {
//   const response: GaugeQueryResponse = await request(
//     GRAPH_API_GAUGES,
//     gql`
//       query Gauges {
//         gauges {
//           id
//           pid
//           chainId
//           boostMultiplier
//           maxVoteCap
//         }
//       }
//     `,
//   )
//   return response.gauges ?? []
// }

export const useGauges = () => {
  const gaugesVotingContract = useGaugesVotingContract()
  const gaugesCount = useGaugesVotingCount()
  const { chainId } = useActiveChainId()
  const publicClient = usePublicClient({ chainId })
  const { data } = useQuery(
    ['gauges', Number(gaugesCount), gaugesVotingContract.address],
    async (): Promise<GaugeInfo[]> => {
      if (!gaugesCount) return []
      const contracts: MulticallContracts<ContractFunctionConfig<typeof gaugesVotingABI, 'gauges'>[]> = []
      for (let index = 0; index < gaugesCount; index++) {
        contracts.push({
          ...gaugesVotingContract,
          functionName: 'gauges',
          args: [BigInt(index)],
        } as const)
      }

      const response = (await publicClient.multicall({
        contracts,
        allowFailure: false,
      })) as ContractFunctionResult<typeof gaugesVotingABI, 'gauges'>[]

      const result = response.reduce((prev, curr) => {
        const [pid, masterChef, _chainId, pairAddress, boostMultiplier, maxVoteCap] = curr
        return [
          ...prev,
          {
            pid,
            masterChef,
            chainId: _chainId,
            pairAddress,
            boostMultiplier,
            maxVoteCap,
          },
        ]
      }, [] as GaugeInfo[])

      return result
    },
    {
      enabled: !!gaugesVotingContract,
    },
  )

  return data
}
