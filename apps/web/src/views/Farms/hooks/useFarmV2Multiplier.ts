import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { BSC_BLOCK_TIME } from 'config'
import { useCallback, useMemo } from 'react'
import { useFarms } from 'state/farms/hooks'

export function useFarmV2Multiplier() {
  const { regularCakePerBlock, totalRegularAllocPoint } = useFarms()

  const totalMultipliers = useMemo(
    () => (Number.isFinite(+totalRegularAllocPoint) ? (+totalRegularAllocPoint / 10).toString() : '-'),
    [totalRegularAllocPoint],
  )

  return {
    totalMultipliers,
    getFarmCakePerSecond: useCallback(
      (poolWeight?: BigNumber) => {
        const farmCakePerSecondNum =
          poolWeight && regularCakePerBlock ? poolWeight.times(regularCakePerBlock).dividedBy(BSC_BLOCK_TIME) : BIG_ZERO

        const farmCakePerSecond = farmCakePerSecondNum.isZero()
          ? '0'
          : farmCakePerSecondNum.lt(0.000001)
          ? '<0.000001'
          : `~${farmCakePerSecondNum.toFixed(6)}`
        return farmCakePerSecond
      },
      [regularCakePerBlock],
    ),
    getNumberFarmCakePerSecond: useCallback(
      (poolWeight?: BigNumber) => {
        const farmCakePerSecondNum =
          poolWeight && regularCakePerBlock ? poolWeight.times(regularCakePerBlock).dividedBy(BSC_BLOCK_TIME) : BIG_ZERO
        return farmCakePerSecondNum.toNumber()
      },
      [regularCakePerBlock],
    ),
  }
}
