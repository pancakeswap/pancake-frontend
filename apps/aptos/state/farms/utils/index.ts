import { createAccountResourceFilter } from '@pancakeswap/awgmi/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getFarmConfig } from 'config/constants/farms'
import { SerializedFarm, SerializedFarmUserData, SerializedClassicFarmConfig } from '@pancakeswap/farms'
import { mainnetTokens } from 'config/constants/tokens/index'
import { FarmResource, MapFarmResource } from 'state/farms/types'
import { FARMS_ADDRESS, FARMS_MODULE_NAME, FARMS_NAME } from 'state/farms/constants'

export const mapFarmList = ({ data }: FarmResource): MapFarmResource[] => {
  return data.lp.map((lpAddress, index) => ({
    ...data,
    pid: index,
    lpAddress,
    singlePoolInfo: data.pool_info[index],
    singleUserInfo: data.user_info[index].inner.handle,
  }))
}

export const transformFarm =
  (chainId) =>
  (farm): SerializedFarm => {
    console.log('farm', farm)
    const farmConfig = getFarmConfig(chainId)
    const token = farmConfig.find(
      (config) => config.lpAddress.toLowerCase() === farm.lpAddress.toLowerCase(),
    ) as SerializedClassicFarmConfig
    // Testnet will get chainId 1 first, this will cause image not found.
    const { symbol, address } = mainnetTokens.apt
    const defaultToken = {
      pid: 0,
      lpSymbol: symbol,
      lpAddress: address,
      token: mainnetTokens.apt,
      quoteToken: mainnetTokens.apt,
    } as SerializedClassicFarmConfig

    const tokenInfo = token ?? defaultToken

    const userData = {
      allowance: '0',
      tokenBalance: '0',
      stakedBalance: '0',
      earnings: '0',
    } as SerializedFarmUserData

    const totalRegularAllocPoint = farm.total_regular_alloc_point
    const allocPoint = farm.singlePoolInfo ? new BigNumber(farm.singlePoolInfo.alloc_point) : BIG_ZERO
    const poolWeight = totalRegularAllocPoint ? allocPoint.div(new BigNumber(totalRegularAllocPoint)) : BIG_ZERO

    return {
      ...tokenInfo,
      poolWeight: poolWeight.toJSON(),
      multiplier: `${allocPoint.div(100).toString()}X`,
      userData,
    }
  }

export const farmsPublicDataSelector = createAccountResourceFilter<FarmResource>({
  address: FARMS_ADDRESS,
  moduleName: FARMS_MODULE_NAME,
  name: FARMS_NAME,
})
