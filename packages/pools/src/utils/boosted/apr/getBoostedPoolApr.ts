import { Address, PublicClient } from 'viem'
import { getBoostedPoolConfig } from '../../../constants/boostedPools'
import { BoosterType } from '../types'
import { fetchAlpBoostedPoolApr } from './fetchAlpBoostedPoolApr'

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

  // ALP pools
  if (pool?.boosterType === BoosterType.ALP) {
    const result = await fetchAlpBoostedPoolApr(client, chainId)
    return result
  }

  return 0
}
