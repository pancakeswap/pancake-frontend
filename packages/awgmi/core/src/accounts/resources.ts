import { MoveResource, Hex } from '@aptos-labs/ts-sdk'
import { TxnBuilderTypes, TypeTagParser } from 'aptos'
import { CoinStoreResult, COIN_STORE_TYPE_PREFIX } from '../coins/coinStore'
import { getProvider } from '../providers'

export type FetchAccountResourcesArgs = {
  /** Address */
  address: string
  /** Network to use for provider */
  networkName?: string
}

export type FetchAccountResourcesResult = MoveResource[]

export async function fetchAccountResources({
  address,
  networkName,
}: FetchAccountResourcesArgs): Promise<FetchAccountResourcesResult> {
  const provider = getProvider({ networkName })

  const resources = await provider.getAccountResources({
    accountAddress: address,
  })

  return resources
}

// account resources selector
type TypeTagFilter = { address?: string; moduleName?: string; name?: string }

const typeTagFilter = ({ address, moduleName, name }: TypeTagFilter) => {
  const filter = (data: FetchAccountResourcesResult[number]) => {
    const parsed = new TypeTagParser(data.type).parseTypeTag()
    if (parsed instanceof TxnBuilderTypes.TypeTagStruct) {
      if (address && new Hex(parsed.value.address.address).toString() !== Hex.fromHexInput(address).toString())
        return false

      if (moduleName && parsed.value.module_name.value !== moduleName) return false
      if (name && parsed.value.name.value !== name) return false

      return true
    }
    return false
  }

  return filter
}

export function createAccountResourceFilter<T extends MoveResource>(query: string | TypeTagFilter) {
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
  address: new Hex(coinStoreTypeTag.address.address).toString(),
  moduleName: coinStoreTypeTag.module_name.value,
  name: coinStoreTypeTag.name.value,
})
