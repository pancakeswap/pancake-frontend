import masterchefABI from 'config/abi/masterchef.json'
import BigNumber from 'bignumber.js'
import { multicallv2 } from 'utils/multicall'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getMasterChefV3Address } from '../../utils/addressHelpers'

export const fetchMasterChefV3FarmPoolLength = async (chainId: number) => {
  try {
    const [poolLength] = await multicallv2({
      abi: masterchefABI,
      calls: [
        {
          name: 'poolLength',
          address: getMasterChefV3Address(chainId),
        },
      ],
      chainId,
    })

    return new BigNumber(poolLength).toNumber()
  } catch (error) {
    console.error('Fetch MasterChef Farm Pool Length Error: ', error)
    return BIG_ZERO.toNumber()
  }
}
