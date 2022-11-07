import BigNumber from 'bignumber.js'
import { MapFarmResource, FarmResourcePoolInfo } from 'state/farms/types'

const ACC_CAKE_PRECISION = 100000000
const TOTAL_CAKE_RATE_PRECISION = 100000

export function pendingCake(userAmount, userRewardDebt, accCakePerShare) {
  // ((user_info.amount * acc_cake_per_share / ACC_CAKE_PRECISION - user_info.reward_debt) as u64)
  return new BigNumber(userAmount).times(accCakePerShare).dividedBy(ACC_CAKE_PRECISION).minus(userRewardDebt)
}

export function calcCakeReward(masterChef: MapFarmResource, pid: string) {
  const poolInfo: FarmResourcePoolInfo = masterChef.pool_info[pid]
  const currentTimestamp = new Date().getTime() / 1000
  const lastRewardTimestamp = Number(poolInfo.last_reward_timestamp)
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
    const multiplier = currentTimestamp - lastRewardTimestamp

    if (supply > 0 && totalAllocPoint > 0) {
      cakeReward =
        (multiplier *
          ((Number(masterChef.cake_per_second) * cakeRate * Number(poolInfo.alloc_point)) / totalAllocPoint)) /
        TOTAL_CAKE_RATE_PRECISION
      accCakePerShare = Number(poolInfo.acc_cake_per_share) + (cakeReward * ACC_CAKE_PRECISION) / supply
    }
  }

  return accCakePerShare
}
