import { useAccountResources } from '@pancakeswap/awgmi'
import { TxnBuilderTypes, TypeTagParser } from 'aptos'
import {
  IFO_RESOURCE_ACCOUNT_ADDRESS,
  IFO_RESOURCE_ACCOUNT_TYPE_METADATA,
  IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE,
} from 'views/Ifos/constants'
import { RootObject as IFOMetadata } from 'views/Ifos/generated/IFOMetadata'
import { RootObject as IFOPoolStore } from 'views/Ifos/generated/IFOPoolStore'

export const useIfoResources = () => {
  return useAccountResources({
    address: IFO_RESOURCE_ACCOUNT_ADDRESS,
    // watch: true,
    select: (data) => {
      const res: {
        [IFO_RESOURCE_ACCOUNT_TYPE_METADATA]?: IFOMetadata
        [IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]?: IFOPoolStore
      } = {}
      for (const it of data) {
        const parsedTypeTag = new TypeTagParser(it.type).parseTypeTag() as TxnBuilderTypes.TypeTagStruct
        res[parsedTypeTag.value.name.value] = it
      }
      return res
    },
  })
}
