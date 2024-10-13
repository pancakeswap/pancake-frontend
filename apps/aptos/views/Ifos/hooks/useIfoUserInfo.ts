import { useAccount, useAccountResources } from '@pancakeswap/awgmi'
import { ifos } from 'config/constants/ifo'
import { RootObject as UserInfo } from 'views/Ifos/generated/UserInfo'
import { IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE, USER_IFO_POOL_TAG, IFO_TYPE_USER_INFO } from 'views/Ifos/constants'
import { useCallback } from 'react'
import { FetchAccountResourcesResult } from '@pancakeswap/awgmi/core'

export const useIfoUserInfoList = () => {
  const { account } = useAccount()

  return useAccountResources({
    enabled: !!account,
    address: account?.address,
    watch: true,
    select: useCallback((resources: FetchAccountResourcesResult) => {
      return resources.filter((resource) => {
        return resource.type.includes(USER_IFO_POOL_TAG)
      }) as UserInfo[]
    }, []),
  })
}

export const useIfoUserInfo = (poolType) => {
  const { account } = useAccount()

  return useAccountResources({
    enabled: !!account && !!ifos[0],
    address: account?.address,
    watch: true,
    select: useCallback(
      (data: FetchAccountResourcesResult) => {
        return data.find((it) => {
          return it.type === poolType?.replace(IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE, IFO_TYPE_USER_INFO)
        }) as UserInfo | undefined
      },
      [poolType],
    ),
  })
}
