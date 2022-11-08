import _toNumber from 'lodash/toNumber'
import _get from 'lodash/get'
import { FixedNumber } from '@ethersproject/bignumber'

import getSecondsLeftFromNow from './getSecondsLeftFromNow'

export default function getFarmTokenPerSecond({
  lastRewardTimestamp,
  rewardPerSecond,
  currentRewardDebt,
  tokenPerShare,
  precisionFactor,
  totalStake,
  userStakedAmount,
}) {
  if (!userStakedAmount) return '0'

  const multiplier = FixedNumber.from(getSecondsLeftFromNow(lastRewardTimestamp))

  const rewardPendingToken = FixedNumber.from(rewardPerSecond).mulUnsafe(multiplier)

  const fPrecisionFactor = FixedNumber.from(precisionFactor)

  const rewardDebt = FixedNumber.from(currentRewardDebt)
  const latestTokenPerShare = FixedNumber.from(tokenPerShare).addUnsafe(
    rewardPendingToken.mulUnsafe(fPrecisionFactor).divUnsafe(FixedNumber.from(totalStake)),
  )

  const pendingReward = FixedNumber.from(userStakedAmount)
    .mulUnsafe(latestTokenPerShare)
    .divUnsafe(fPrecisionFactor)
    .subUnsafe(rewardDebt)
    .toString()

  return pendingReward
}
