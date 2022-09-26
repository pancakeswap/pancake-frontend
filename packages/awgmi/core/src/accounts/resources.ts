import { Types } from 'aptos'
import { CoinStoreResult, COIN_STORE_TYPE_PREFIX } from '../coins/coinStore'
import { getProvider } from '../provider'

export type FetchAccountResourcesArgs = {
  /** Address or ANS name */
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
export function createAccountResourceFilter<T extends Types.MoveResource>(filterString: string) {
  const filter = (data: FetchAccountResourcesResult[number]): data is T => {
    return data.type.includes(filterString)
  }

  return filter
}

export const coinStoreResourcesFilter = createAccountResourceFilter<{ type: string; data: CoinStoreResult }>(
  COIN_STORE_TYPE_PREFIX,
)
