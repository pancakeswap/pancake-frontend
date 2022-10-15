import { Types } from 'aptos'
import { getProvider } from '../provider'

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
