/* eslint-disable camelcase */
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from 'config/constants/types'
import { useCallback } from 'react'
import { IFO_RESOURCE_ACCOUNT_TYPE_METADATA } from 'views/Ifos/constants'
import { VestingCharacteristics } from 'views/Ifos/types'
import { useIfoPool } from '../useIfoPool'
import { useIfoResources } from '../useIfoResources'
import { useVestingCharacteristics } from './useVestingCharacteristics'

export interface VestingData {
  ifo: Ifo
  userVestingData: {
    vestingStartTime: number
    [PoolIds.poolUnlimited]: VestingCharacteristics
  }
}

export const useFetchUserWalletIfoData = () => {
  const resources = useIfoResources()
  const pool = useIfoPool()
  const vestingCharacteristics = useVestingCharacteristics()

  const fetchUserWalletIfoData = useCallback(
    async (ifo: Ifo): Promise<VestingData> => {
      const metadata = resources.data?.[IFO_RESOURCE_ACCOUNT_TYPE_METADATA]?.data

      const userVestingData = {
        vestingStartTime: metadata?.vesting_start_time ? +metadata.vesting_start_time : 0,
        [PoolIds.poolUnlimited]: {
          ...vestingCharacteristics,
          offeringAmountInToken: pool.data ? new BigNumber(pool.data.offering_amount) : BIG_ZERO,
        },
      }

      return {
        ifo,
        userVestingData,
      }
    },
    [pool, resources, vestingCharacteristics],
  )

  return { fetchUserWalletIfoData }
}
