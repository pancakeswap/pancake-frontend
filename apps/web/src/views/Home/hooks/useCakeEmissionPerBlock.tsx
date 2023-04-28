import useSWRImmutable from 'swr/immutable'
import { multicallv3 } from 'utils/multicall'
import BigNumber from 'bignumber.js'
import masterChefAbi from 'config/abi/masterchef.json'
import { getMasterChefAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

const CAKE_PER_BLOCK = 40
const masterChefAddress = getMasterChefAddress()

const useCakeEmissionPerBlock = () => {
  const { data: emissionsPerBlock } = useSWRImmutable('/cakeEmissionPerBlock', async () => {
    const [cakePerBlockToBurn] = await multicallv3({
      calls: [
        {
          name: 'cakePerBlockToBurn',
          address: masterChefAddress,
          abi: masterChefAbi,
        },
      ],
    })

    const balance = getBalanceNumber(cakePerBlockToBurn)
    return new BigNumber(CAKE_PER_BLOCK).minus(balance).toNumber()
  })

  return emissionsPerBlock
}

export default useCakeEmissionPerBlock
