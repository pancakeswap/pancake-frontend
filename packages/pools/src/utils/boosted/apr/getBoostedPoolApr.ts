import { ChainId } from '@pancakeswap/chains'
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

  // Arbitrum ALP pools
  if (pool?.boosterType === BoosterType.ALP && chainId === ChainId.ARBITRUM_ONE) {
    const result = await fetchAlpBoostedPoolApr(client)
    return result
  }

  return 0
}
