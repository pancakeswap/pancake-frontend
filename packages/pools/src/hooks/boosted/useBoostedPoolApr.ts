import { Address } from 'viem'
import { ChainId } from '@pancakeswap/chains'
import { checkIsBoostedPool } from '../../utils'
import { getLivePoolsConfig } from '../../constants'
// import { fetchAlpBoostedPoolApr } from 'utils/fetchAlpBoostedPoolApr'

interface UseBoostedPoolApr {
  contractAddress: Address
  chainId: number | undefined
}

export const useBoostedPoolApr = ({ contractAddress, chainId }: UseBoostedPoolApr): number => {
  const isBoostedPool = Boolean(chainId && checkIsBoostedPool(contractAddress, chainId))
  const poolConfig = getLivePoolsConfig(chainId ?? ChainId.BSC)
  const pool = poolConfig?.find((i) => i.contractAddress.toLowerCase() === contractAddress.toLowerCase())

  if (!contractAddress || !chainId || !isBoostedPool) {
    return 0
  }

  if (
    pool?.stakingToken?.chainId === ChainId.ARBITRUM_ONE &&
    pool?.contractAddress?.toLowerCase() === contractAddress.toLowerCase()
  ) {
    return 1.2
    // await fetchAlpBoostedPoolApr()
  }

  return 0
}
