import { useAccount } from '@pancakeswap/awgmi'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Ifo } from 'config/constants/types'
import { useMemo } from 'react'
import splitTypeTag from 'utils/splitTypeTag'
import {
  IfoPoolKey,
  IFO_RESOURCE_ACCOUNT_TYPE_METADATA,
  IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE,
} from 'views/Ifos/constants'
import { RootObject as IFOPool } from 'views/Ifos/generated/IFOPool'
import type { VestingCharacteristics } from 'views/Ifos/types'
import {
  computeNextVestingScheduleIdForHolderAndPid,
  computeReleaseAmount,
  computeVestingScheduleId,
} from 'views/Ifos/utils'
import { useIfoResources } from '../useIfoResources'
import { useIfoVestingSchedule, useIfoVestingSchedules } from '../useIfoVestingSchedule'

function getPoolID(poolType?: string) {
  if (!poolType) return '0'

  const [_0, _1, uidTag] = splitTypeTag(poolType)
  const [_2, _3, uid] = uidTag?.split('::') || []
  const pid = uid?.replace('U', '') || '0'

  return pid
}

function mapVestingCharacteristics({ pool, account, vestingSchedule, resourcesMetaData }) {
  const pid = getPoolID(pool?.type)

  const ifoPool = pool?.data as unknown as IFOPool

  const unlimitedId =
    account?.address && pool?.data && vestingSchedule.data
      ? computeNextVestingScheduleIdForHolderAndPid(account.address, pid, {
          vesting_schedule: vestingSchedule.data,
        })
      : undefined

  const vestingComputeReleasableAmount =
    resourcesMetaData && ifoPool && vestingSchedule.data
      ? computeReleaseAmount(resourcesMetaData, ifoPool, vestingSchedule.data)
      : BIG_ZERO

  return {
    vestingId: unlimitedId ? unlimitedId.toString() : '0',
    vestingComputeReleasableAmount,
    vestingInformationPercentage: ifoPool?.vesting_percentage ? +ifoPool.vesting_percentage : 0,
    vestingInformationDuration: ifoPool?.vesting_duration ? +ifoPool.vesting_duration : 0,
    vestingReleased: vestingSchedule.data ? new BigNumber(vestingSchedule.data.amount_released) : BIG_ZERO,
    vestingAmountTotal: vestingSchedule.data ? new BigNumber(vestingSchedule.data.amount_total) : BIG_ZERO,
    isVestingInitialized: !!vestingSchedule.data,
  }
}

export const useVestingCharacteristicsList = (resourcesList) => {
  const { account } = useAccount()

  const vestingScheduleId = useMemo(
    () => (account?.address ? computeVestingScheduleId(account.address, +IfoPoolKey.UNLIMITED) : undefined),
    [account?.address],
  )

  const vestingSchedules = useIfoVestingSchedules({ key: vestingScheduleId, resourcesList })

  return useMemo(() => {
    return vestingSchedules?.map((vestingSchedule, idx) => {
      if (!vestingSchedule?.isSuccess) {
        return undefined
      }

      return mapVestingCharacteristics({
        account,
        vestingSchedule,
        pool: resourcesList[idx][IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE],
        resourcesMetaData: resourcesList[idx][IFO_RESOURCE_ACCOUNT_TYPE_METADATA]?.data,
      })
    })
  }, [account, resourcesList, vestingSchedules])
}

export const useVestingCharacteristics = (
  ifo: Ifo,
): VestingCharacteristics & {
  isVestingInitialized: boolean
} => {
  const { account } = useAccount()

  const vestingScheduleId = useMemo(
    () => (account?.address ? computeVestingScheduleId(account.address, +IfoPoolKey.UNLIMITED) : undefined),
    [account?.address],
  )

  const resources = useIfoResources(ifo)
  const pool = resources?.data?.[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]

  const vestingSchedule = useIfoVestingSchedule({ key: vestingScheduleId, resources: resources?.data })

  return useMemo(() => {
    return mapVestingCharacteristics({
      account,
      vestingSchedule,
      pool,
      resourcesMetaData: resources?.data?.[IFO_RESOURCE_ACCOUNT_TYPE_METADATA]?.data,
    })
  }, [account, vestingSchedule, pool, resources?.data])
}
