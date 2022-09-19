import { getBCakeMultiplier } from 'components/RoiCalculatorModal/BCakeCalculator'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { useUserLockedCakeStatus } from 'views/Farms/hooks/useUserLockedCakeStatus'
import { useCakeVaultPublicData, useCakeVaultUserData } from 'state/pools/hooks'
import { secondsToWeeks } from 'views/Pools/components/utils/formatSecondsToWeeks'
import useAvgLockDuration from 'views/Pools/components/LockedPool/hooks/useAvgLockDuration'

export const useGetBoostedMultiplier = (userBalanceInFarm: BigNumber, lpTotalSupply: BigNumber) => {
  useCakeVaultPublicData()
  useCakeVaultUserData()
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { isLoading, lockedAmount, totalLockedAmount, lockedStart, lockedEnd } = useUserLockedCakeStatus()
  const bCakeMultiplier = useMemo(() => {
    const result = getBCakeMultiplier(
      userBalanceInFarm, // userBalanceInFarm,
      lockedAmount, // userLockAmount
      new BigNumber(secondsToWeeks(_toNumber(lockedEnd) - _toNumber(lockedStart))).times(7), // userLockDuration
      totalLockedAmount, // totalLockAmount
      lpTotalSupply, // lpBalanceOfFarm
      new BigNumber(avgLockDurationsInSeconds ? secondsToWeeks(avgLockDurationsInSeconds) : 40).times(7), // AverageLockDuration
    )
    return result.toString() === 'NaN' || isLoading ? '1.000' : result.toFixed(3)
  }, [
    userBalanceInFarm,
    lpTotalSupply,
    totalLockedAmount,
    avgLockDurationsInSeconds,
    lockedAmount,
    lockedEnd,
    lockedStart,
    isLoading,
  ])
  return _toNumber(bCakeMultiplier)
}

const useGetBoostedAPR = (
  userBalanceInFarm: BigNumber,
  lpTotalSupply: BigNumber,
  apr: number,
  lpRewardsApr: number,
) => {
  const bCakeMultiplier = useGetBoostedMultiplier(userBalanceInFarm, lpTotalSupply)
  return (apr * bCakeMultiplier + lpRewardsApr).toFixed(2)
}

export default useGetBoostedAPR
