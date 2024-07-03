import { Hex, MoveResource, TypeTagStruct, parseTypeTag } from '@aptos-labs/ts-sdk'
import { COIN_STORE_TYPE_PREFIX, CoinStoreResult } from '../coins/coinStore'
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
    const parsed = parseTypeTag(data.type)
    if (parsed.isStruct()) {
      if (address && new Hex(parsed.value.address.data).toString() !== Hex.fromHexInput(address).toString())
        return false

      if (moduleName && parsed.value.moduleName.identifier !== moduleName) return false
      if (name && parsed.value.name.identifier !== name) return false

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

const coinStoreTypeTag = parseTypeTag(COIN_STORE_TYPE_PREFIX) as TypeTagStruct
export const coinStoreResourcesFilter = createAccountResourceFilter<CoinStoreResource>({
  address: new Hex(coinStoreTypeTag.value.address.data).toString(),
  moduleName: coinStoreTypeTag.value.moduleName.identifier,
  name: coinStoreTypeTag.value.name.identifier,
})
