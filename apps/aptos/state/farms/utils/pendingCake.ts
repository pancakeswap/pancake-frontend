import BigNumber from 'bignumber.js'

const ACC_ICE_PRECISION = 100000000

export function pendingIce(userAmount, userRewardDebt, accCakePerShare) {
  // ((user_info.amount * acc_cake_per_share / ACC_ICE_PRECISION - user_info.reward_debt) as u64)
  return new BigNumber(userAmount).times(accCakePerShare).dividedBy(ACC_ICE_PRECISION).minus(userRewardDebt)
}
