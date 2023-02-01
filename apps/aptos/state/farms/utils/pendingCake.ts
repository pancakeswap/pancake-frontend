import BigNumber from 'bignumber.js'
import { MapFarmResource, FarmResourcePoolInfo } from 'state/farms/types'

const ACC_CAKE_PRECISION = 1000000000000
const TOTAL_CAKE_RATE_PRECISION = 100000

export function calcPendingRewardCake(userAmount, userRewardDebt, accCakePerShare) {
  // ((user_info.amount * acc_cake_per_share / ACC_CAKE_PRECISION - user_info.reward_debt) as u64)
  return new BigNumber(userAmount).times(accCakePerShare).dividedBy(ACC_CAKE_PRECISION).minus(userRewardDebt)
}

export function calcRewardCakePerShare(masterChef: MapFarmResource, pid: string | number, getNow: () => number) {
  const poolInfo: FarmResourcePoolInfo = masterChef.pool_info[pid]
  const currentTimestamp = getNow() / 1000
  const lastRewardTimestamp = Number(poolInfo?.last_reward_timestamp)
  const endTimestamp = Number(masterChef.end_timestamp)
  const lastUpkeepTimestamp = Number(masterChef.last_upkeep_timestamp)

  if (poolInfo) {
    let cakeReward = 0
    let accCakePerShare = Number(poolInfo.acc_cake_per_share)

    if (currentTimestamp > lastRewardTimestamp) {
      let totalAllocPoint = 0
      let cakeRate = 0

      if (poolInfo.is_regular) {
        totalAllocPoint = Number(masterChef.total_regular_alloc_point)
        cakeRate = Number(masterChef.cake_rate_to_regular)
      } else {
        totalAllocPoint = Number(masterChef.total_special_alloc_point)
        cakeRate = Number(masterChef.cake_rate_to_special)
      }

      const supply = Number(poolInfo.total_amount)
      let multiplier = 0

      if (endTimestamp <= lastRewardTimestamp) {
        multiplier = 0
      } else if (currentTimestamp <= endTimestamp) {
        multiplier = new BigNumber(currentTimestamp).minus(max(lastRewardTimestamp, lastUpkeepTimestamp)).toNumber()
      } else {
        multiplier = new BigNumber(endTimestamp).minus(max(lastRewardTimestamp, lastUpkeepTimestamp)).toNumber()
      }

      if (supply > 0 && totalAllocPoint > 0) {
        const reward = new BigNumber(masterChef.cake_per_second)
          .times(cakeRate)
          .times(poolInfo.alloc_point)
          .div(totalAllocPoint)
        cakeReward = new BigNumber(multiplier).times(reward).div(TOTAL_CAKE_RATE_PRECISION).toNumber()
        const perShare = new BigNumber(cakeReward).times(ACC_CAKE_PRECISION).div(supply)
        accCakePerShare = new BigNumber(poolInfo.acc_cake_per_share).plus(perShare).toNumber()
      }
      return accCakePerShare
    }
  }
  return 0
}

const max = (a: number, b: number): number => {
  return a >= b ? a : b
}
