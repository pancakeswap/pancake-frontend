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

  const rorHistorySnapshotData = useMemo(() => {
    if (!rorData || !totalStakedInUsd)
      return { sevenDayRor: 0, thirtyDayRor: 0, earliestDayRor: 0, isRorLoading: isLoading }

    const today = floorToUTC00(Date.now())
    const sevenDay = floorToUTC00(today - 7 * ONE_DAY_MILLISECONDS)
    const thirtyDay = floorToUTC00(today - 30 * ONE_DAY_MILLISECONDS)

    const earliestCuttoffTimestamp = rorData
    const sevenDayCuttoffTimestamp = createVaultHistorySubArray(rorData, sevenDay / 1000)
    const thirtyDayCuttoffTimestamp = createVaultHistorySubArray(rorData, thirtyDay / 1000)

    const totalThirtyDayUsd = thirtyDayCuttoffTimestamp.reduce((sum, entry) => sum + Number(entry?.usd), 0) ?? 0
    const totalSevenDayUsd = sevenDayCuttoffTimestamp?.reduce((sum, entry) => sum + Number(entry?.usd), 0) ?? 0
    const earliestDayUsd = earliestCuttoffTimestamp?.reduce((sum, entry) => sum + Number(entry?.usd), 0) ?? 0

    const averageThirtyDayUsd = new BigNumber(totalThirtyDayUsd / thirtyDayCuttoffTimestamp.length)
    const averageSevenDayUsd = new BigNumber(totalSevenDayUsd / sevenDayCuttoffTimestamp.length)
    const averageEarliestDayUsd = new BigNumber(earliestDayUsd / earliestCuttoffTimestamp.length)

    const sevenDayRor = new BigNumber(totalStakedInUsd).minus(averageSevenDayUsd).div(averageSevenDayUsd).toNumber()
    const thirtyDayRor = new BigNumber(totalStakedInUsd).minus(averageThirtyDayUsd).div(averageThirtyDayUsd).toNumber()
    const earliestDayRor = new BigNumber(totalStakedInUsd)
      .minus(averageEarliestDayUsd)
      .div(averageEarliestDayUsd)
      .toNumber()

    return { sevenDayRor, thirtyDayRor, earliestDayRor, isRorLoading: isLoading }
  }, [rorData, totalStakedInUsd, isLoading])

  return rorHistorySnapshotData
}
