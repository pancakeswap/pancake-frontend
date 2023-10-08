import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'

import { useIfUserLocked } from './useStakedPools'

export default function useIsBoost({ minBoostAmount, boostDayPercent }) {
  const { locked, amount: lockedCakeAmount } = useIfUserLocked()

  return Boolean(
    boostDayPercent > 0 &&
      locked &&
      lockedCakeAmount.gte(getBalanceAmount(new BigNumber(minBoostAmount || ('0' as unknown as BigNumber.Value)))),
  )
}
