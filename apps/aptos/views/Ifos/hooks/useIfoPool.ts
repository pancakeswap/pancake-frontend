/* eslint-disable camelcase */
import { useTableItem, UseTableItemConfig } from '@pancakeswap/awgmi'
import { IfoPoolKey, IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE } from 'views/Ifos/constants'
import { RootObject as IFOPool } from 'views/Ifos/generated/IFOPool'
import { useIfoResources } from './useIfoResources'

export const useIfoPool = (params: UseTableItemConfig<IFOPool> = {}) => {
  const resources = useIfoResources()

  return useTableItem<IFOPool>({
    ...params,
    handle: resources.data?.[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]?.data.ifo_pools.handle,
    data: resources.data?.[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]
      ? {
          key: IfoPoolKey.UNLIMITED,
          keyType: 'u64',
          valueType: resources.data[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE].type.replace(
            IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE,
            'IFOPool',
          ),
        }
      : undefined,
  })
}
