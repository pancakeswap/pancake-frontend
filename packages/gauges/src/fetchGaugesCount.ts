import { PublicClient } from 'viem'
import { getContract } from './contract'

export const fetchGaugesCount = async (
  client: PublicClient,
  options?: {
    blockNumber?: bigint
  },
): Promise<number> => {
  const contract = getContract(client)

  const count = await contract.read.gaugeCount(options)

  return Number(count || 0)
}
