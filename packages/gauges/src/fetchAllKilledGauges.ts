import { ContractFunctionConfig, ContractFunctionResult, Hex, MulticallContracts, PublicClient } from 'viem'
import { gaugesVotingABI } from './abis'
import { getContract } from './contract'
import { GaugeInfo } from './types'

export const filterKilledGauges = async (client: PublicClient, gauges: GaugeInfo[]): Promise<GaugeInfo[]> => {
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
  })) as ContractFunctionResult<typeof gaugesVotingABI, 'gaugeIsKilled_'>[]

  return gauges.filter((_, index) => {
    return !response[index]
  })
}
