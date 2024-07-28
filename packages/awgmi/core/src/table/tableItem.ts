import { MoveResource, TableItemRequest } from '@aptos-labs/ts-sdk'

import { getProvider } from '../providers'

export type FetchTableItemArgs = {
  /** Network to use for provider */
  networkName?: string
  handle: string
  data: {
    keyType: TableItemRequest['key_type']
    valueType: TableItemRequest['value_type']
    key: TableItemRequest['key']
  }
}

export async function fetchTableItem({ networkName, handle, data }: FetchTableItemArgs): Promise<MoveResource[]> {
  const provider = getProvider({ networkName })

  return provider.getTableItem({
    handle,
    data: {
      key: data.key,
      value_type: data.valueType,
      key_type: data.keyType,
    },
  })
}
