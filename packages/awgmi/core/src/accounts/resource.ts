import { MoveResource, MoveStructId } from '@aptos-labs/ts-sdk'

import { getProvider } from '../providers'

export type FetchAccountResourceArgs = {
  /** Address */
  address: string
  /** Network to use for provider */
  networkName?: string
  /** String representation of an on-chain Move struct type */
  resourceType: MoveStructId
}

export type FetchAccountResourceResult<T = unknown> = Omit<MoveResource, 'data'> & { data: T }

export async function fetchAccountResource<T>({
  address,
  networkName,
  resourceType,
}: FetchAccountResourceArgs): Promise<FetchAccountResourceResult<T>> {
  const provider = getProvider({ networkName })

  const resource = await provider.getAccountResource({
    accountAddress: address,
    resourceType,
  })

  return { type: resourceType, data: resource }
}
