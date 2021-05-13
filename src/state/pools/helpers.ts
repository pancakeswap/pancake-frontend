import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'

type UserData =
  | Pool['userData']
  | {
      allowance: number | string
      stakingTokenBalance: number | string
      stakedBalance: number | string
      pendingReward: number | string
    }

export const transformUserData = (userData: UserData) => {
  return {
    allowance: new BigNumber(userData.allowance || 0),
    stakingTokenBalance: new BigNumber(userData.stakingTokenBalance || 0),
    stakedBalance: new BigNumber(userData.stakedBalance || 0),
    pendingReward: new BigNumber(userData.pendingReward || 0),
  }
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
