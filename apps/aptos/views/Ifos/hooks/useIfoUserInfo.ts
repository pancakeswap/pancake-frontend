/* eslint-disable camelcase */
import { useAccount, useTableItem } from '@pancakeswap/awgmi'
import { IFO_MODULE_NAME, IFO_RESOURCE_ACCOUNT_ADDRESS } from 'views/Ifos/constants'
import { RootObject as UserInfo } from 'views/Ifos/generated/UserInfo'
import { useIfoPool } from './useIfoPool'

export const useIfoUserInfo = () => {
  const { account } = useAccount()
  const pool = useIfoPool()

  return useTableItem<UserInfo>({
    handle: pool.data?.user_infos.handle,
    data:
      !!account && pool.data?.user_infos.handle
        ? {
            key: account.address,
            keyType: 'address',
            valueType: `${IFO_RESOURCE_ACCOUNT_ADDRESS}::${IFO_MODULE_NAME}::UserInfo`,
          }
        : undefined,
  })
}
