import erc20 from 'config/abi/erc20.json'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { SerializedFarm } from '../types'
import { SerializedFarmConfig } from '../../config/constants/types'

const fetchFarmCalls = (farm: SerializedFarm) => {
  const { lpAddresses, token, quoteToken } = farm
  const lpAddress = getAddress(lpAddresses)
  return [
    // Balance of token in the LP contract
    {
      address: token.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: quoteToken.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [getMasterChefAddress()],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: token.address,
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: quoteToken.address,
      name: 'decimals',
    },
  ]
}

export const fetchPublicFarmsData = async (farms: SerializedFarmConfig[]): Promise<any[]> => {
  const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm))
  const chunkSize = farmCalls.length / farms.length
  const farmMultiCallResult = await multicallv2(erc20, farmCalls)
  return farmMultiCallResult.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize)

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])
}
