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

export const useIfoResources = (ifo: Ifo) => {
  return useAccountResources({
    enabled: !!ifo,
    address: IFO_ADDRESS,
    watch: true,
    select: (data) => {
      const res: {
        [IFO_RESOURCE_ACCOUNT_TYPE_METADATA]?: IFOMetadata
        [IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE]?: IFOPoolStore
        [IFO_RESOURCE_ACCOUNT_TYPE_VESTING_METADATA]?: VestingMetadata
      } = {}

      for (const it of data) {
        try {
          const [raisingCoin, offeringCoin] = splitTypeTag(it.type)
          if (raisingCoin === ifo.currency.address && offeringCoin === ifo.token.address) {
            const parsedTypeTag = new TypeTagParser(it.type).parseTypeTag() as TxnBuilderTypes.TypeTagStruct

            res[parsedTypeTag.value.name.value] = it
          }
          // eslint-disable-next-line no-empty
        } catch {}
      }
      return res
    },
  })
}
