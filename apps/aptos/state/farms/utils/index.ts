import { createAccountResourceFilter } from '@pancakeswap/awgmi/core'
import _get from 'lodash/get'
import { getFarmConfig } from 'config/constants/farms'
import { SerializedFarm, SerializedFarmUserData, SerializedClassicFarmConfig } from '@pancakeswap/farms'
import { mainnetTokens } from 'config/constants/tokens/index'
import { FARMS_ADDRESS, FARMS_MODULE_NAME, FARMS_NAME } from '../constants'
import { FarmResource } from '../types'

export const mapFarmList = ({ data }: FarmResource) => {
  return data.lp.map((lpAddress, index) => ({
    ...data,
    pid: index,
    lpAddress,
    poolInfo: data.pool_info[index],
    userInfoAddress: data.user_info[index].inner.handle,
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

    const userData = {
      allowance: '0',
      tokenBalance: '0',
      stakedBalance: '0',
      earnings: '0',
    } as SerializedFarmUserData

    return {
      ...tokenInfo,
      userData,
    }
  }

export const farmsPublicDataSelector = createAccountResourceFilter<FarmResource>({
  address: FARMS_ADDRESS,
  moduleName: FARMS_MODULE_NAME,
  name: FARMS_NAME,
})
