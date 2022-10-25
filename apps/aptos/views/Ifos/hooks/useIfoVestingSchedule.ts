/* eslint-disable camelcase */
import { useTableItem } from '@pancakeswap/awgmi'
import { IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA } from 'views/Ifos/constants'
import { RootObject as VestingSchedule } from 'views/Ifos/generated/VestingSchedule'
import { useIfoResources } from './useIfoResources'

export const useIfoVestingSchedule = ({ key }: { key?: Uint8Array }) => {
  const resources = useIfoResources()

  return useTableItem<VestingSchedule>({
    handle: resources.data?.[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA]?.data.vesting_schedules.handle,
    data:
      resources.data?.[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA] && key
        ? {
            key,
            keyType: 'vector<u8>',
            valueType: resources.data[IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA].type.replace(
              IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA,
              'VestingSchedule',
            ),
          }
        : undefined,
  })
}
