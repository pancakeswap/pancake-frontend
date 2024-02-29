import { PublicClient } from 'viem'
import { getCalcContract } from './contract'
import { Gauge, GaugeInfoConfig } from './types'

export const fetchAllGaugesVoting = async (
  client: PublicClient,
  gaugeInfos: GaugeInfoConfig[],
  inCap: boolean = true,
  options?: {
    blockNumber?: bigint
  },
): Promise<Gauge[]> => {
  const contract = getCalcContract(client)

  const weights = await contract.read.massGetGaugeWeight([inCap], options)

  return gaugeInfos.map((gauge) => ({
    ...gauge,
    weight: weights[gauge.gid] ?? 0n,
  }))
}
