import { ChainId } from '@pancakeswap/chains'
import { getBoostedPoolsConfig } from '../constants/boostedPools'

export const isBoostedPool = (contract: string, chainId: ChainId): boolean => {
  const list = getBoostedPoolsConfig(chainId)
  const isBoosted = list?.find((i) => i?.contractAddress?.toLowerCase() === contract.toLowerCase())

  return isBoosted !== undefined
}
