import BigNumber from 'bignumber.js'
import { ONE_DAY_MILLISECONDS } from 'config/constants/info'
import { useMemo } from 'react'
import type { Address } from 'viem'
import { useChainId } from 'wagmi'
import { AprResult } from './useApr'
import { useFetchVaultHistory } from './useFetchVaultHistory'

interface RorProps {
  vault: Address | undefined
  totalStakedInUsd: number
}

export interface RorResult {
  sevenDayRor: number
  thirtyDayRor: number
  isRorLaoding: boolean
}

const floorToUTC00 = (timestamp: number): number => {
  const date = new Date(timestamp)
  date.setUTCHours(0, 0, 0, 0)
  return date.getTime()
}

export const useRor = ({ vault, totalStakedInUsd }: RorProps): AprResult => {
  const chainId = useChainId()
  const { data: rorData, isLoading } = useFetchVaultHistory({ vault, chainId })

  // console.log(rorData)
  const rorHistorySnapshotData = useMemo(() => {
    if (!rorData || !totalStakedInUsd) return { sevenDayRor: 0, thirtyDayRor: 0, isRorLoading: isLoading }

    const now = Date.now()
    const today = floorToUTC00(now)
    const sevenDay = floorToUTC00(today - 7 * ONE_DAY_MILLISECONDS)

    const vaultThirdyDayHistory = rorData
    const vaultSevenDayHistory = [rorData.find((data) => sevenDay / 1000 < data.timestamp)]

    const totalThirtyDayUsd = vaultThirdyDayHistory.reduce((sum, entry) => sum + Number(entry?.usd), 0) ?? 0
    const averageThirtyDayUsd = new BigNumber(totalThirtyDayUsd / vaultThirdyDayHistory.length)

    const totalSevenDayUsd = vaultSevenDayHistory?.reduce((sum, entry) => sum + Number(entry?.usd), 0) ?? 0
    const averageSevenDayUsd = new BigNumber(totalSevenDayUsd / vaultSevenDayHistory.length)

    const sevenDayRor = new BigNumber(totalStakedInUsd).minus(averageSevenDayUsd).div(averageSevenDayUsd).toNumber()
    const thirtyDayRor = new BigNumber(totalStakedInUsd).minus(averageThirtyDayUsd).div(averageThirtyDayUsd).toNumber()

    return { sevenDayRor, thirtyDayRor, isRorLoading: isLoading }
  }, [rorData, totalStakedInUsd, isLoading])

  return rorHistorySnapshotData
}
