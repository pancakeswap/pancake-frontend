import { useCallback, useMemo } from 'react'
import { useFarmsV3Public } from 'state/farmsV3/hooks'

export function useFarmV3Multiplier() {
  const { data: farmV3 } = useFarmsV3Public()
  const { totalAllocPoint, cakePerSecond } = farmV3
  const totalMultipliers = useMemo(
    () => (Number.isFinite(+totalAllocPoint) ? (+totalAllocPoint / 10).toString() : '-'),
    [totalAllocPoint],
  )

  return {
    totalMultipliers,
    getFarmCakePerSecond: useCallback(
      (poolWeight?: string) => {
        const farmCakePerSecondNum = poolWeight && cakePerSecond ? Number(poolWeight) * Number(cakePerSecond) : 0
        return farmCakePerSecondNum === 0
          ? '0'
          : farmCakePerSecondNum < 0.000001
          ? '<0.000001'
          : `~${farmCakePerSecondNum.toFixed(6)}`
      },
      [cakePerSecond],
    ),
  }
}
