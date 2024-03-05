import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { DeserializedBCakeWrapperUserData, DeserializedFarmUserData, SerializedFarm } from '../types'

export const deserializeFarmUserData = (farm?: SerializedFarm): DeserializedFarmUserData => {
  return {
    allowance: farm?.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm?.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm?.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm?.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
    proxy: {
      allowance: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.allowance) : BIG_ZERO,
      tokenBalance: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.tokenBalance) : BIG_ZERO,
      stakedBalance: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.stakedBalance) : BIG_ZERO,
      earnings: farm?.userData?.proxy ? new BigNumber(farm?.userData?.proxy.earnings) : BIG_ZERO,
    },
  }
}

export const deserializeFarmBCakeUserData = (farm?: SerializedFarm): DeserializedBCakeWrapperUserData => {
  return {
    allowance: farm?.bCakeUserData ? new BigNumber(farm.bCakeUserData.allowance) : BIG_ZERO,
    tokenBalance: farm?.bCakeUserData ? new BigNumber(farm.bCakeUserData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm?.bCakeUserData ? new BigNumber(farm.bCakeUserData.stakedBalance) : BIG_ZERO,
    earnings: farm?.bCakeUserData ? new BigNumber(farm.bCakeUserData.earnings) : BIG_ZERO,
  }
}
