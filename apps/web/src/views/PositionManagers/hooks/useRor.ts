import BigNumber from 'bignumber.js'
import { ONE_DAY_MILLISECONDS } from 'config/constants/info'
import { useMemo } from 'react'
import type { Address } from 'viem'
import { useChainId } from 'wagmi'
import { floorToUTC00 } from '../utils/floorCurrentTimestamp'
import { useFetchVaultHistory, type VaultData } from './useFetchVaultHistory'

interface RorProps {
  vault: Address | undefined
  totalStakedInUsd: number
  startTimestamp: number | undefined
}

export interface RorResult {
  sevenDayRor: number
  thirtyDayRor: number
  earliestDayRor: number
  isRorLoading: boolean
}

function createVaultHistorySubArray(array: VaultData[], target: number): VaultData[] {
  const startIndex = array.findIndex((element) => element.timestamp > target)
  if (startIndex === -1) return []
  return array.slice(startIndex)
}

export const useRor = ({ vault, totalStakedInUsd, startTimestamp }: RorProps): RorResult => {
  const chainId = useChainId()
  const { data: rorData, isLoading } = useFetchVaultHistory({ vault, chainId, earliest: startTimestamp })

  return useMemo(() => {
    if (!rorData || !totalStakedInUsd)
      return { sevenDayRor: 0, thirtyDayRor: 0, earliestDayRor: 0, isRorLoading: isLoading }

    const todayFlooredUnix = floorToUTC00(Date.now())
    const sevenDayFlooredUnix = floorToUTC00(todayFlooredUnix - 7 * ONE_DAY_MILLISECONDS)
    const thirtyDayFlooredUnix = floorToUTC00(todayFlooredUnix - 30 * ONE_DAY_MILLISECONDS)

    const allTimeVaultData = rorData
    const sevenDayVaultData = createVaultHistorySubArray(rorData, sevenDayFlooredUnix / 1000)
    const thirtyDayVaultData = createVaultHistorySubArray(rorData, thirtyDayFlooredUnix / 1000)

    const totalSevenDayUsd = sevenDayVaultData?.reduce((sum, entry) => sum + Number(entry?.usd), 0) ?? 0
    const totalThirtyDayUsd = thirtyDayVaultData.reduce((sum, entry) => sum + Number(entry?.usd), 0) ?? 0
    const earliestDayUsd = allTimeVaultData?.reduce((sum, entry) => sum + Number(entry?.usd), 0) ?? 0

    const averageSevenDayUsd = new BigNumber(totalSevenDayUsd / sevenDayVaultData.length)
    const averageThirtyDayUsd = new BigNumber(totalThirtyDayUsd / thirtyDayVaultData.length)
    const averageEarliestDayUsd = new BigNumber(earliestDayUsd / allTimeVaultData.length)

    const sevenDayRor = new BigNumber(totalStakedInUsd).minus(averageSevenDayUsd).div(averageSevenDayUsd).toNumber()
    const thirtyDayRor = new BigNumber(totalStakedInUsd).minus(averageThirtyDayUsd).div(averageThirtyDayUsd).toNumber()
    const earliestDayRor = new BigNumber(totalStakedInUsd)
      .minus(averageEarliestDayUsd)
      .div(averageEarliestDayUsd)
      .toNumber()

    return { sevenDayRor, thirtyDayRor, earliestDayRor, isRorLoading: isLoading }
  }, [rorData, totalStakedInUsd, isLoading])
}
