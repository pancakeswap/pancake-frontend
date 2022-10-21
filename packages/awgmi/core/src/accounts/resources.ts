import { HexString, TxnBuilderTypes, Types, TypeTagParser } from 'aptos'
import { CoinStoreResult, COIN_STORE_TYPE_PREFIX } from '../coins/coinStore'
import { getProvider } from '../providers'

export type FetchAccountResourcesArgs = {
  /** Address */
  address: string
  /** Network to use for provider */
  networkName?: string
}

export type FetchAccountResourcesResult = Types.MoveResource[]

export async function fetchAccountResources({
  address,
  networkName,
}: FetchAccountResourcesArgs): Promise<FetchAccountResourcesResult> {
  const provider = getProvider({ networkName })

  const resources = await provider.getAccountResources(address)

  return resources
}

// account resources selector
type TypeTagFilter = { address?: string; moduleName?: string; name?: string }

const typeTagFilter = ({ address, moduleName, name }: TypeTagFilter) => {
  const filter = (data: FetchAccountResourcesResult[number]) => {
    const parsed = new TypeTagParser(data.type).parseTypeTag()
    if (parsed instanceof TxnBuilderTypes.TypeTagStruct) {
      if (
        address &&
        HexString.fromUint8Array(parsed.value.address.address).toShortString() !==
          HexString.ensure(address).toShortString()
      )
        return false

      if (moduleName && parsed.value.module_name.value !== moduleName) return false
      if (name && parsed.value.name.value !== name) return false

      return true
    }
    return false
  }

  return filter
}

export function createAccountResourceFilter<T extends Types.MoveResource>(query: string | TypeTagFilter) {
  const typeTagFilterFn = typeof query !== 'string' && typeTagFilter(query)
  const filter = (data: FetchAccountResourcesResult[number]): data is T => {
    if (typeof query === 'string') {
      return data.type.includes(query)
    }
    if (typeTagFilterFn) {
      return typeTagFilterFn(data)
    }
    return false
  }

  return filter
}

export type CoinStoreResource<T extends string = string> = {
  type: `0x1::coin::CoinStore<${T}>`
  data: CoinStoreResult
}

const coinStoreTypeTag = TxnBuilderTypes.StructTag.fromString(COIN_STORE_TYPE_PREFIX)
export const coinStoreResourcesFilter = createAccountResourceFilter<CoinStoreResource>({
  address: HexString.fromUint8Array(coinStoreTypeTag.address.address).toShortString(),
  moduleName: coinStoreTypeTag.module_name.value,
  name: coinStoreTypeTag.name.value,
})
