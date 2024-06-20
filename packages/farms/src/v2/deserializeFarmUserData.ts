import { bscTestnetTokens } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
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
    boosterMultiplier: farm?.bCakeUserData?.boosterMultiplier ?? 1,
    boostedAmounts: farm?.bCakeUserData?.boostedAmounts ? new BigNumber(farm.bCakeUserData.boostedAmounts) : BIG_ZERO,
    boosterContractAddress: farm?.bCakeUserData?.boosterContractAddress,
    rewardPerSecond: farm?.bCakeUserData?.rewardPerSecond
      ? getBalanceAmount(new BigNumber(farm?.bCakeUserData?.rewardPerSecond), bscTestnetTokens.cake.decimals).toNumber()
      : 0,
    startTimestamp: farm?.bCakeUserData?.startTimestamp,
    endTimestamp: farm?.bCakeUserData?.endTimestamp,
  }
}

export const deserializeFarmBCakePublicData = (farm?: SerializedFarm): DeserializedBCakeWrapperUserData => {
  // const isRewardInRange = true
  const isRewardInRange =
    farm?.bCakePublicData?.startTimestamp &&
    farm?.bCakePublicData?.endTimestamp &&
    Date.now() / 1000 >= farm.bCakePublicData.startTimestamp &&
    Date.now() / 1000 < farm.bCakePublicData.endTimestamp
  return {
    allowance: farm?.bCakePublicData ? new BigNumber(farm.bCakePublicData.allowance) : BIG_ZERO,
    tokenBalance: farm?.bCakePublicData ? new BigNumber(farm.bCakePublicData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm?.bCakePublicData ? new BigNumber(farm.bCakePublicData.stakedBalance) : BIG_ZERO,
    earnings: farm?.bCakePublicData ? new BigNumber(farm.bCakePublicData.earnings) : BIG_ZERO,
    boosterMultiplier: isRewardInRange ? farm?.bCakePublicData?.boosterMultiplier ?? 1 : 1,
    boostedAmounts: farm?.bCakePublicData?.boostedAmounts
      ? new BigNumber(farm.bCakePublicData.boostedAmounts)
      : BIG_ZERO,
    boosterContractAddress: farm?.bCakePublicData?.boosterContractAddress,
    rewardPerSecond:
      farm?.bCakePublicData?.rewardPerSecond && isRewardInRange
        ? getBalanceAmount(
            new BigNumber(farm?.bCakePublicData?.rewardPerSecond),
            bscTestnetTokens.cake.decimals,
          ).toNumber()
        : 0,
    startTimestamp: farm?.bCakePublicData?.startTimestamp,
    endTimestamp: farm?.bCakePublicData?.endTimestamp,
    isRewardInRange: Boolean(isRewardInRange),
    totalLiquidityX: farm?.bCakePublicData?.totalLiquidityX ?? 1,
  }
}
