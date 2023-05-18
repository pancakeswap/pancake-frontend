import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { getMasterChefV2Address } from 'utils/addressHelpers'
import { formatEther } from 'viem'
import { useContractRead } from 'wagmi'

const CAKE_PER_BLOCK = 40
const masterChefAddress = getMasterChefV2Address()

export const useCakeEmissionPerBlock = (inView?: boolean) => {
  const { data: emissionsPerBlock } = useContractRead({
    abi: masterChefV2ABI,
    address: masterChefAddress,
    chainId: ChainId.BSC,
    functionName: 'cakePerBlockToBurn',
    enabled: inView,
    select: (d) => {
      const burn = formatEther(d)
      return new BigNumber(CAKE_PER_BLOCK).minus(burn).toNumber()
    },
  })

  return emissionsPerBlock
}
