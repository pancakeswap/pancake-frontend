import { useAccount } from '@pancakeswap/awgmi'
import { useInterval, useLastUpdated } from '@pancakeswap/hooks'
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
import useLedgerTimestamp from 'hooks/useLedgerTimestamp'
import { useIfoResources } from '../useIfoResources'
import { useIfoVestingSchedule, useIfoVestingSchedules } from '../useIfoVestingSchedule'

export const IFO_RESET_INTERVAL = 1000 * 10

function getPoolID(poolType?: string) {
  if (!poolType) return '0'

  const [_0, _1, uidTag] = splitTypeTag(poolType)
  const [_2, _3, uid] = uidTag?.split('::') || []
  const pid = uid?.replace('U', '') || '0'

  return pid
}

function mapVestingCharacteristics({ getNow, pool, account, vestingSchedule, resourcesMetaData }) {
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
      ? computeReleaseAmount(getNow, resourcesMetaData, ifoPool, vestingSchedule.data)
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
  const getNow = useLedgerTimestamp()

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
        getNow,
        account,
        vestingSchedule,
        pool: resourcesList[idx][IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE],
        resourcesMetaData: resourcesList[idx][IFO_RESOURCE_ACCOUNT_TYPE_METADATA]?.data,
      })
    })
  }, [getNow, account, resourcesList, vestingSchedules])
}

export const useVestingCharacteristics = (
  ifo: Ifo,
): VestingCharacteristics & {
  isVestingInitialized: boolean
} => {
  // Due to computeReleaseAmount in mapVestingCharacteristics use Date() to update attribute
  // Force update to get the latest computeReleaseAmount
  const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()
  useInterval(refresh, IFO_RESET_INTERVAL)

  const { account } = useAccount()
  const getNow = useLedgerTimestamp()

  const vestingScheduleId = useMemo(
    () => (account?.address ? computeVestingScheduleId(account.address, +IfoPoolKey.UNLIMITED) : undefined),
    [account?.address],
  )

  const resources = useIfoResources(ifo)
  const pool = resources?.data?.[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]

  const vestingSchedule = useIfoVestingSchedule({ key: vestingScheduleId, resources: resources?.data })

  return useMemo(() => {
    return mapVestingCharacteristics({
      getNow,
      account,
      vestingSchedule,
      pool,
      resourcesMetaData: resources?.data?.[IFO_RESOURCE_ACCOUNT_TYPE_METADATA]?.data,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNow, account, vestingSchedule, pool, resources?.data, lastUpdated])
}
