import { useAccount } from '@pancakeswap/awgmi'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA } from 'views/Ifos/constants'
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
    () => (account?.address ? computeVestingScheduleId(account.address, 0) : undefined),
    [account?.address],
  )

  const resources = useIfoResources()
  const pool = useIfoPool()
  const vestingSchedule = useIfoVestingSchedule({ key: vestingScheduleId })

  return useMemo(() => {
    const unlimitedId =
      account?.address && pool.data && vestingSchedule.data
        ? computeNextVestingScheduleIdForHolderAndPid(account.address, pool.data.pid, {
            vesting_schedule: vestingSchedule.data,
          })
        : undefined

    const vestingComputeReleasableAmount =
      pool.data && vestingSchedule.data
        ? computeReleaseAmount(resources[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA], pool.data, vestingSchedule.data)
        : BIG_ZERO

    return {
      vestingId: unlimitedId ? unlimitedId.toString() : '0',
      offeringAmountInToken: pool.data ? new BigNumber(pool.data.offering_amount) : BIG_ZERO,
      vestingComputeReleasableAmount,
      vestingInformationPercentage: pool.data ? +pool.data.vesting_percentage : 0,
      vestingInformationDuration: pool.data ? +pool.data.vesting_duration : 0,
      vestingReleased: vestingSchedule.data ? new BigNumber(vestingSchedule.data.amount_released) : BIG_ZERO,
      vestingAmountTotal: vestingSchedule.data ? new BigNumber(vestingSchedule.data.amount_total) : BIG_ZERO,
      isVestingInitialized: !!vestingSchedule.data,
    }
  }, [resources, pool, vestingSchedule])
}
