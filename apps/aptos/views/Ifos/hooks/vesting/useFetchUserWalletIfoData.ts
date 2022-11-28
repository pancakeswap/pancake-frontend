import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { Ifo, PoolIds } from 'config/constants/types'
import { useMemo } from 'react'
import { IFO_RESOURCE_ACCOUNT_TYPE_METADATA, IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE } from 'views/Ifos/constants'
import { ifos } from 'config/constants/ifo'
import splitTypeTag from 'utils/splitTypeTag'

import { VestingCharacteristics } from 'views/Ifos/types'
import { computeOfferingAndRefundAmount } from 'views/Ifos/utils'
import { useIfoResourcesListByUserInfoType } from '../useIfoResources'
import { useIfoUserInfoList } from '../useIfoUserInfo'
import { useVestingCharacteristicsList } from './useVestingCharacteristics'

export interface VestingData {
  ifo: Ifo
  userVestingData: {
    vestingStartTime: number
    [PoolIds.poolUnlimited]: VestingCharacteristics & {
      offeringAmountInToken: BigNumber
    }
  }
}

export const useFetchUserWalletIfoData = (): VestingData[] => {
  const userIfoList = useIfoUserInfoList()

  const userIfoListWithAmount = userIfoList?.data?.filter(({ data }) => _toNumber(data.amount))

  const poolList = useIfoResourcesListByUserInfoType(userIfoListWithAmount?.map(({ type }) => type))

  const poolListArray = useMemo(() => {
    const poolListData = poolList?.data || {}

    return Object.keys(poolListData)?.map((k) => ({ ...poolListData[k], type: k }))
  }, [poolList])

  const vestingCharacteristicsList = useVestingCharacteristicsList(poolListArray)

  const ifoDataList = useMemo(() => {
    if (!userIfoListWithAmount) return []

    return vestingCharacteristicsList?.reduce((result: VestingData[], vestingCharacteristics, idx) => {
      if (!vestingCharacteristics || !userIfoListWithAmount) return result

      const resource = poolListArray[idx]

      const pool = resource[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]
      const metadata = resource[IFO_RESOURCE_ACCOUNT_TYPE_METADATA]

      const [stakingTokenAddress, offeringTokenAddress] = splitTypeTag(metadata.type)

      const ifo = ifos.find(
        (i) => i.currency.address === stakingTokenAddress && i.token.address === offeringTokenAddress,
      )

      if (!ifo) return result

      const foundUserIfo = userIfoListWithAmount.find((userIfo) => userIfo.type === resource.type)

      const { offering_amount: offeringAmountInToken } = foundUserIfo
        ? computeOfferingAndRefundAmount(foundUserIfo?.data?.amount, pool?.data)
        : {
            offering_amount: BIG_ZERO,
          }

      const userVestingData = {
        vestingStartTime: metadata?.vesting_start_time ? +metadata.vesting_start_time : 0,
        [PoolIds.poolUnlimited]: {
          ...vestingCharacteristics,
          offeringAmountInToken,
        },
      }

      result.push({
        ifo,
        userVestingData,
      })

      return result
    }, [])
  }, [poolListArray, userIfoListWithAmount, vestingCharacteristicsList])

  return ifoDataList
}
