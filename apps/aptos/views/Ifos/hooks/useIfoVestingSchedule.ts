/* eslint-disable camelcase */
import { useTableItem, useTableItems, type PayloadTableItem } from '@pancakeswap/awgmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA } from 'views/Ifos/constants'
import { RootObject as VestingSchedule } from 'views/Ifos/generated/VestingSchedule'

export const useIfoVestingSchedule = ({ key, resources }: { key?: string; resources?: any }) => {
  return useTableItem<VestingSchedule>({
    handle: resources?.[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA]?.data.vesting_schedules.handle,
    data:
      resources?.[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA] && key
        ? {
            key,
            keyType: 'vector<u8>',
            valueType: resources[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA].type.replace(
              IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA,
              'VestingSchedule',
            ),
          }
        : undefined,
  })
}

export const useIfoVestingSchedules = ({ key, resourcesList }: { key?: string; resourcesList?: any[] }) => {
  const hasLength = Boolean(resourcesList?.length)
  const { networkName } = useActiveWeb3React()

  const results = useTableItems({
    networkName: networkName || '',
    handles: hasLength
      ? resourcesList?.map(
          (resources) =>
            resources?.[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA]?.data.vesting_schedules.handle as string,
        )
      : [],
    data: hasLength
      ? resourcesList?.map((resources) => {
          return {
            key,
            keyType: 'vector<u8>',
            valueType: resources[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA].type.replace(
              IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA,
              'VestingSchedule',
            ),
          } as PayloadTableItem
        })
      : [],
  })

  return hasLength && results?.length && resourcesList?.length === results?.length ? results : []
}
