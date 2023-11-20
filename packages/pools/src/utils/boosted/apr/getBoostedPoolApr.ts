import { Address, PublicClient } from 'viem'
import { BoosterType } from '../types'
import { fetchAlpBoostedPoolApr } from './fetchAlpBoostedPoolApr'
import { getBoostedPoolsConfig } from '../../../constants/boostedPools'

interface GetBoostedPoolApr {
  client: PublicClient
  contractAddress: Address
  chainId: number | undefined
}

export const getBoostedPoolApr = async ({ client, contractAddress, chainId }: GetBoostedPoolApr): Promise<number> => {
  const list = chainId && getBoostedPoolsConfig(chainId)

  if (!contractAddress || !chainId || !list) {
    return 0
  }

  const pool = list?.find((i) => i?.contractAddress?.toLowerCase() === contractAddress.toLowerCase())
  // Arbitrum ALP pools
  if (pool?.boosterType === BoosterType.ALP) {
    const result = await fetchAlpBoostedPoolApr(client)
    return result
  }

  return 0
}
