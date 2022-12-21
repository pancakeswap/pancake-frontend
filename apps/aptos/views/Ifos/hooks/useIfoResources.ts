import { useAccountResources } from '@pancakeswap/awgmi'
import { TxnBuilderTypes, TypeTagParser } from 'aptos'
import splitTypeTag from 'utils/splitTypeTag'
import {
  IFO_ADDRESS,
  IFO_RESOURCE_ACCOUNT_TYPE_METADATA,
  IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE,
  IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA,
} from 'views/Ifos/constants'
import { RootObject as IFOMetadata } from 'views/Ifos/generated/IFOMetadata'
import { RootObject as IFOPoolStore } from 'views/Ifos/generated/IFOPoolStore'
import { RootObject as VestingMetadata } from 'views/Ifos/generated/VestingMetadata'
import { Ifo } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

interface ResourceType {
  [IFO_RESOURCE_ACCOUNT_TYPE_METADATA]?: IFOMetadata
  [IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]?: IFOPoolStore
  [IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA]?: VestingMetadata
}

export const useIfoResourcesListByUserInfoType = (userInfoTypes?: string[]) => {
  const { networkName } = useActiveWeb3React()

  return useAccountResources({
    networkName,
    enabled: Boolean(userInfoTypes?.length),
    address: IFO_ADDRESS,
    watch: true,
    select: (data) => {
      let resourcesList = {}

      for (const it of data) {
        const res: ResourceType = {}
        const [raisingCoin, offeringCoin, uid] = splitTypeTag(it.type)

        const foundType = userInfoTypes?.find((type) => {
          const [userRaisingCoin, userOfferingCoin, userUid] = splitTypeTag(type)

          if (raisingCoin === userRaisingCoin && offeringCoin === userOfferingCoin) {
            if (uid && uid !== userUid) return false

            return true
          }

          return false
        })

        if (foundType) {
          const parsedTypeTag = new TypeTagParser(it.type).parseTypeTag() as TxnBuilderTypes.TypeTagStruct

          const key = parsedTypeTag.value.name.value

          res[key] = it

          resourcesList = {
            ...resourcesList,
            [foundType]: {
              ...resourcesList[foundType],
              [key]: it,
            },
          }
        }
      }

      return resourcesList
    },
  })
}

export const useIfoResources = (ifo: Ifo) => {
  const { networkName } = useActiveWeb3React()

  const [ifoRaisingCoin, ifoOfferingCoin, ifoUid] = splitTypeTag(ifo.address)

  return useAccountResources({
    enabled: !!ifo,
    networkName,
    address: IFO_ADDRESS,
    watch: true,
    select: (data) => {
      const res: {
        [IFO_RESOURCE_ACCOUNT_TYPE_METADATA]?: IFOMetadata
        [IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]?: IFOPoolStore
        [IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA]?: VestingMetadata
      } = {}

      for (const it of data) {
        const [raisingCoin, offeringCoin, uid] = splitTypeTag(it.type)

        if (ifoRaisingCoin === raisingCoin && ifoOfferingCoin === offeringCoin) {
          if (uid && uid !== ifoUid) break

          const parsedTypeTag = new TypeTagParser(it.type).parseTypeTag() as TxnBuilderTypes.TypeTagStruct

          res[parsedTypeTag.value.name.value] = it
        }
      }

      return res
    },
  })
}
