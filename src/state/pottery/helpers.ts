import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import {
  SerializedPotteryUserData,
  DeserializedPotteryUserData,
  SerializedPotteryPublicData,
  DeserializedPublicData,
} from 'state/types'

export const transformPotteryPublicData = (publicData: SerializedPotteryPublicData): DeserializedPublicData => {
  const { totalPrize, totalLockCake, totalSupply, totalLockedValue } = publicData

  return {
    ...publicData,
    totalPrize: totalPrize ? new BigNumber(totalPrize) : BIG_ZERO,
    totalLockCake: totalLockCake ? new BigNumber(totalLockCake) : BIG_ZERO,
    totalSupply: totalSupply ? new BigNumber(totalSupply) : BIG_ZERO,
    totalLockedValue: totalLockedValue ? new BigNumber(totalLockedValue) : BIG_ZERO,
  }
}

export const transformPotteryUserData = (userData: SerializedPotteryUserData): DeserializedPotteryUserData => {
  const { rewards, allowance, stakingTokenBalance } = userData

  return {
    ...userData,
    rewards: rewards ? new BigNumber(rewards) : BIG_ZERO,
    allowance: allowance ? new BigNumber(allowance) : BIG_ZERO,
    stakingTokenBalance: stakingTokenBalance ? new BigNumber(stakingTokenBalance) : BIG_ZERO,
  }
}
