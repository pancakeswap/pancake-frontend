import { useAccount } from '@pancakeswap/awgmi'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { IfoPoolKey, IFO_RESOURCE_ACCOUNT_TYPE_METADATA } from 'views/Ifos/constants'
import type { VestingCharacteristics } from 'views/Ifos/types'
import {
  computeNextVestingScheduleIdForHolderAndPid,
  computeReleaseAmount,
  computeVestingScheduleId,
} from 'views/Ifos/utils'
import { useIfoPool } from '../useIfoPool'
import { useIfoResources } from '../useIfoResources'
import { useIfoVestingSchedule } from '../useIfoVestingSchedule'

export const useVestingCharacteristics = (): VestingCharacteristics & {
  isVestingInitialized: boolean
} => {
  const { account } = useAccount()

  const vestingScheduleId = useMemo(
    () => (account?.address ? computeVestingScheduleId(account.address, +IfoPoolKey.UNLIMITED) : undefined),
    [account?.address],
  )

  const resources = useIfoResources()
  const pool = useIfoPool()
  const vestingSchedule = useIfoVestingSchedule({ key: vestingScheduleId })

  return useMemo(() => {
    const unlimitedId =
      account?.address && pool?.data && vestingSchedule.data
        ? computeNextVestingScheduleIdForHolderAndPid(account.address, pool.data.pid, {
            vesting_schedule: vestingSchedule.data,
          })
        : undefined

    const vestingComputeReleasableAmount =
      resources.data?.[IFO_RESOURCE_ACCOUNT_TYPE_METADATA] && pool?.data && vestingSchedule.data
        ? computeReleaseAmount(
            resources.data[IFO_RESOURCE_ACCOUNT_TYPE_METADATA].data,
            pool?.data,
            vestingSchedule.data,
          )
        : BIG_ZERO

    return {
      vestingId: unlimitedId ? unlimitedId.toString() : '0',
      vestingComputeReleasableAmount,
      vestingInformationPercentage: pool?.data?.vesting_percentage ? +pool.data?.vesting_percentage : 0,
      vestingInformationDuration: pool?.data?.vesting_duration ? +pool.data?.vesting_duration : 0,
      vestingReleased: vestingSchedule.data ? new BigNumber(vestingSchedule.data.amount_released) : BIG_ZERO,
      vestingAmountTotal: vestingSchedule.data ? new BigNumber(vestingSchedule.data.amount_total) : BIG_ZERO,
      isVestingInitialized: !!vestingSchedule.data,
    }
  }, [account?.address, resources, pool, vestingSchedule])
}
