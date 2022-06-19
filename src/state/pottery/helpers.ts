import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import {
  SerializedPotteryUserData,
  DeserializedPotteryUserData,
  SerializedPotteryPublicData,
  DeserializedPublicData,
} from 'state/types'

export const transformPotteryPublicData = (publicData: SerializedPotteryPublicData): DeserializedPublicData => {
  const { totalLockCake, totalSupply } = publicData

  return {
    ...publicData,
    totalLockCake: totalLockCake ? new BigNumber(totalLockCake) : BIG_ZERO,
    totalSupply: totalSupply ? new BigNumber(totalSupply) : BIG_ZERO,
  }
}

export const transformPotteryUserData = (userData: SerializedPotteryUserData): DeserializedPotteryUserData => {
  const { allowance, stakingTokenBalance } = userData

  return {
    ...userData,
    allowance: allowance ? new BigNumber(allowance) : BIG_ZERO,
    stakingTokenBalance: stakingTokenBalance ? new BigNumber(stakingTokenBalance) : BIG_ZERO,
  }
}
