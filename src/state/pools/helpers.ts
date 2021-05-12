import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'

export const transformUserData = (userData: Pool['userData']) => {
  return userData
    ? {
        allowance: new BigNumber(userData.allowance),
        stakingTokenBalance: new BigNumber(userData.stakingTokenBalance),
        stakedBalance: new BigNumber(userData.stakedBalance),
        pendingReward: new BigNumber(userData.pendingReward),
      }
    : userData
}

export const transformPool = (pool: Pool): Pool => {
  const { totalStaked, stakingLimit, userData, ...rest } = pool

  return {
    ...rest,
    userData: transformUserData(userData),
    totalStaked: new BigNumber(totalStaked),
    stakingLimit: new BigNumber(stakingLimit),
  } as Pool
}
