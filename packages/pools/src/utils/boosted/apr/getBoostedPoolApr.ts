import { Address, PublicClient } from 'viem'
import { ChainId } from '@pancakeswap/chains'
import { checkIsBoostedPool } from '../checkIsBoostedPool'
import { fetchAlpBoostedPoolApr } from './fetchAlpBoostedPoolApr'

interface GetBoostedPoolApr {
  client: PublicClient
  sousId: number
  contractAddress: Address
  chainId: number | undefined
}

export const getBoostedPoolApr = async ({
  client,
  sousId,
  contractAddress,
  chainId,
}: GetBoostedPoolApr): Promise<number> => {
  const isBoostedPool = Boolean(chainId && checkIsBoostedPool(contractAddress, chainId))

  if (!contractAddress || !chainId || !isBoostedPool) {
    return 0
  }

  // Arbitrum ALP pools
  if (chainId === ChainId.ARBITRUM_ONE && sousId === 2) {
    const result = await fetchAlpBoostedPoolApr(client)
    return result
  }

  return 0
}
