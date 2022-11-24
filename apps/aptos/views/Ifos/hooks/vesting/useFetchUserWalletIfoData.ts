/* eslint-disable camelcase */
// import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { Ifo, PoolIds } from 'config/constants/types'
// import { useCallback, useMemo } from 'react'
// import { IFO_RESOURCE_ACCOUNT_TYPE_METADATA } from 'views/Ifos/constants'
import { VestingCharacteristics } from 'views/Ifos/types'
// import { computeOfferingAndRefundAmount } from 'views/Ifos/utils'
// import { ifos } from 'config/constants/ifo'
// import { useIfoPool } from '../useIfoPool'
// import { useIfoResources } from '../useIfoResources'
// import { useIfoUserInfo } from '../useIfoUserInfo'
// import { useVestingCharacteristics } from './useVestingCharacteristics'

export interface VestingData {
  ifo: Ifo
  userVestingData: {
    vestingStartTime: number
    [PoolIds.poolUnlimited]: VestingCharacteristics & {
      offeringAmountInToken: BigNumber
    }
  }
}

// const allVestingIfo: Ifo[] = ifos.filter((ifo) => ifo.version >= 3.2 && ifo.vestingTitle)

export const useFetchUserWalletIfoData = () => {
  // const resources = useIfoResources()
  // const pool = useIfoPool()
  // const vestingCharacteristics = useVestingCharacteristics()
  // const { data: userInfo } = useIfoUserInfo(pool?.type)

  const ifoDataList: VestingData[] = []

  // const { offering_amount: offeringAmountInToken } = useMemo(
  //   () =>
  //     userInfo?.data
  //       ? computeOfferingAndRefundAmount(userInfo.data.amount, pool?.data)
  //       : {
  //           tax_amount: BIG_ZERO,
  //           refunding_amount: BIG_ZERO,
  //           offering_amount: BIG_ZERO,
  //         },
  //   [pool?.data, userInfo?.data],
  // )

  // const fetchUserWalletIfoData = useCallback(
  //   async (ifo: Ifo): Promise<VestingData> => {
  //     const metadata = resources.data?.[IFO_RESOURCE_ACCOUNT_TYPE_METADATA]?.data

  //     const userVestingData = {
  //       vestingStartTime: metadata?.vesting_start_time ? +metadata.vesting_start_time : 0,
  //       [PoolIds.poolUnlimited]: {
  //         ...vestingCharacteristics,
  //         offeringAmountInToken,
  //       },
  //     }

  //     return {
  //       ifo,
  //       userVestingData,
  //     }
  //   },
  //   [offeringAmountInToken, resources.data, vestingCharacteristics],
  // )

  return ifoDataList
}
