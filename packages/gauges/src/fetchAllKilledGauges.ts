import { AbiStateMutability, ContractFunctionReturnType, Hex, PublicClient } from 'viem'
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

  const multicalls = []

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
  })) as ContractFunctionReturnType<typeof gaugesVotingABI, AbiStateMutability, 'gaugeIsKilled_'>[]

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
