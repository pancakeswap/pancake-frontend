import { createAccountResourceFilter } from '@pancakeswap/awgmi/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getFarmConfig } from 'config/constants/farms'
import { SerializedFarm, SerializedClassicFarmConfig } from '@pancakeswap/farms'
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

    const allocPoint = farm.singlePoolInfo ? new BigNumber(farm.singlePoolInfo.alloc_point) : BIG_ZERO
    const totalAlloc = farm.singlePoolInfo.is_regular ? farm.total_regular_alloc_point : farm.total_special_alloc_point
    const poolWeight = totalAlloc ? allocPoint.div(new BigNumber(totalAlloc)) : BIG_ZERO

    return {
      ...tokenInfo,
      poolWeight: poolWeight.toJSON(),
      multiplier: `${allocPoint.div(100).toString()}X`,
      userData: {
        allowance: '0',
        tokenBalance: '0',
        stakedBalance: '0',
        earnings: '0',
      },
    }
  }

export const farmsPublicDataSelector = createAccountResourceFilter<FarmResource>({
  address: FARMS_ADDRESS,
  moduleName: FARMS_MODULE_NAME,
  name: FARMS_NAME,
})
