import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { SerializedFarm, DeserializedFarmUserData } from '../types'

export const deserializeFarmUserData = (farm: SerializedFarm): DeserializedFarmUserData => {
  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
    proxy: {
      allowance: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.allowance) : BIG_ZERO,
      tokenBalance: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.tokenBalance) : BIG_ZERO,
      stakedBalance: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.stakedBalance) : BIG_ZERO,
      earnings: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.earnings) : BIG_ZERO,
    },
  }
}
