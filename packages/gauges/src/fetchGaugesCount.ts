import { PublicClient } from 'viem'
import { getContract } from './contract'

export const fetchGaugesCount = async (client: PublicClient): Promise<number> => {
  const contract = getContract(client)

  const count = await contract.read.gaugeCount()

  return Number(count || 0)
}
