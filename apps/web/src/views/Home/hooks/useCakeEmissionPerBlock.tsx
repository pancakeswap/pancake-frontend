import { ChainId } from '@pancakeswap/chains'
import BigNumber from 'bignumber.js'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { getMasterChefV2Address } from 'utils/addressHelpers'
import { formatEther } from 'viem'
import { useReadContract } from '@pancakeswap/wagmi'
import { useCallback } from 'react'

const CAKE_PER_BLOCK = 40
const masterChefAddress = getMasterChefV2Address(ChainId.BSC)!

export const useCakeEmissionPerBlock = (inView?: boolean) => {
  const { data: emissionsPerBlock } = useReadContract({
    abi: masterChefV2ABI,
    address: masterChefAddress,
    chainId: ChainId.BSC,
    functionName: 'cakePerBlockToBurn',
    query: {
      enabled: inView,
      select: useCallback((d: bigint) => {
        const burn = formatEther(d)
        return new BigNumber(CAKE_PER_BLOCK).minus(burn).toNumber()
      }, []),
    },
  })

  return emissionsPerBlock
}
