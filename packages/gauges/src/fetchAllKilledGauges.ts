import { ContractFunctionConfig, ContractFunctionResult, Hex, MulticallContracts, PublicClient } from 'viem'
import { gaugesVotingABI } from './abis'
import { getContract } from './contract'
import { GaugeInfo } from './types'

export const fetchAllKilledGauges = async (
  client: PublicClient,
  gauges: GaugeInfo[],
  options?: {
    blockNumber?: bigint
  },
): Promise<GaugeInfo[]> => {
  const contract = getContract(client)

  const multicalls: MulticallContracts<ContractFunctionConfig<typeof gaugesVotingABI, 'gaugeIsKilled_'>[]> = []

  for (let i = 0; i < gauges.length; i++) {
    multicalls.push({
      ...contract,
      functionName: 'gaugeIsKilled_',
      args: [gauges[i].hash as Hex],
    } as const)
  }

  const response = (await client.multicall({
    contracts: multicalls,
    allowFailure: false,
    ...options,
  })) as ContractFunctionResult<typeof gaugesVotingABI, 'gaugeIsKilled_'>[]

  return gauges.map((gauge, index) => {
    if (response[index] === true) {
      return {
        ...gauge,
        killed: response[index],
      }
    }
    return gauge
  })
}
