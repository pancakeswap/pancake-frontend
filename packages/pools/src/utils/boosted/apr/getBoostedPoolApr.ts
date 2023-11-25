import { Address, PublicClient } from 'viem'
import { BoosterType } from '../types'
import { fetchAlpBoostedPoolApr } from './fetchAlpBoostedPoolApr'
import { getBoostedPoolConfig } from '../../../constants/boostedPools'

interface GetBoostedPoolApr {
  client: PublicClient
  contractAddress: Address
  chainId: number | undefined
}

export const getBoostedPoolApr = async ({ client, contractAddress, chainId }: GetBoostedPoolApr): Promise<number> => {
  const pool = chainId && getBoostedPoolConfig(chainId, contractAddress)

  if (!contractAddress || !chainId || !pool) {
    return 0
  }

  // Arbitrum ALP pools
  if (pool?.boosterType === BoosterType.ALP) {
    const result = await fetchAlpBoostedPoolApr(client)
    return result
  }

  return 0
}
