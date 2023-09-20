import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'

export enum FIXED_STAKING_PERIOD {
  D30 = '30D',
  D60 = '60D',
  D90 = '90D',
}

export interface FixedStakingPool {
  poolIndex: number
  token: Token
  endDay: number
  lockDayPercent: number
  boostDayPercent: number
  unlockDayPercent: number
  lockPeriod: number
  withdrawalCut1: number
  withdrawalCut2: number
  withdrawalFee: number
  depositEnabled: boolean
  maxDeposit: number
  minDeposit: number
  totalDeposited: BigNumber
  maxPoolAmount: number
  minBoostAmount: number
}

export interface StakePositionUserInfo {
  accrueInterest: BigNumber
  boost: boolean
  lastDayAction: number
  userDeposit: BigNumber
}

export interface StakedPosition {
  endLockTime: number
  userInfo: StakePositionUserInfo
  pool: FixedStakingPool
}

export interface PoolGroup {
  token: Token
  minLockDayPercent: number
  maxLockDayPercent: number
  totalDeposited: BigNumber
  pools: FixedStakingPool[]
}

export enum UnstakeType {
  WITHDRAW = 'withdraw',
  HARVEST = 'harvest',
}
