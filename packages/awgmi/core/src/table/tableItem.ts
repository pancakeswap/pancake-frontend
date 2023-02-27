import { Types } from 'aptos'
import { getProvider } from '../providers'

export type FetchTableItemArgs = {
  /** Network to use for provider */
  networkName?: string
  handle: string
  data: {
    keyType: Types.TableItemRequest['key_type']
    valueType: Types.TableItemRequest['value_type']
    key: Types.TableItemRequest['key']
  }
}

export async function fetchTableItem({ networkName, handle, data }: FetchTableItemArgs) {
  const provider = getProvider({ networkName })

  return provider.getTableItem(handle, {
    key: data.key,
    value_type: data.valueType,
    key_type: data.keyType,
  })
}
