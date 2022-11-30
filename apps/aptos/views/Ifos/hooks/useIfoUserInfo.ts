import { useAccount, useAccountResources } from '@pancakeswap/awgmi'
import { ifos } from 'config/constants/ifo'
import { RootObject as UserInfo } from 'views/Ifos/generated/UserInfo'
import { IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE, USER_IFO_POOL_TAG, IFO_TYPE_USER_INFO } from 'views/Ifos/constants'

export const useIfoUserInfoList = () => {
  const { account } = useAccount()

  return useAccountResources({
    enabled: !!account,
    address: account?.address,
    watch: true,
    select: (resources) => {
      return resources.filter((resource) => {
        return resource.type.includes(USER_IFO_POOL_TAG)
      }) as UserInfo[]
    },
  })
}

export const useIfoUserInfo = (poolType) => {
  const { account } = useAccount()

  return useAccountResources({
    enabled: !!account && !!ifos[0],
    address: account?.address,
    watch: true,
    select: (data) => {
      return data.find((it) => {
        return it.type === poolType?.replace(IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE, IFO_TYPE_USER_INFO)
      }) as UserInfo | undefined
    },
  })
}
