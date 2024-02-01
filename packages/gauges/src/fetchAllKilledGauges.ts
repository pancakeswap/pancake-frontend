import { Hex, PublicClient } from 'viem'
import { getContract } from './contract'
import { GaugeInfo } from './types'

export const filterKilledGauges = async (client: PublicClient, gauges: GaugeInfo[]): Promise<GaugeInfo[]> => {
  const contract = getContract(client)

  const response = await client.multicall({
    contracts: Array.from({ length: gauges.length }).map(
      (_, i) =>
        ({
          ...contract,
          functionName: 'gaugeIsKilled_',
          args: [gauges[i].hash as Hex],
        } as const),
    ),
    allowFailure: false,
  })

  return gauges.filter((_, index) => {
    return !response[index]
  })
}
