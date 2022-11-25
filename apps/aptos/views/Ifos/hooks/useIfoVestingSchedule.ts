/* eslint-disable camelcase */
import { useTableItem, useTableItems } from '@pancakeswap/awgmi'
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

  const { data: results } = useTableItems({
    handles: hasLength
      ? resourcesList?.map(
          (resources) => resources?.[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA]?.data.vesting_schedules.handle,
        )
      : [],
    data: hasLength
      ? resourcesList?.map((resources) => {
          return resources?.[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA] && key
            ? {
                key,
                keyType: 'vector<u8>',
                valueType: resources[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA].type.replace(
                  IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA,
                  'VestingSchedule',
                ),
              }
            : undefined
        })
      : [],
  })

  return hasLength && results?.length && resourcesList?.length === results?.length ? resourcesList : []
}
