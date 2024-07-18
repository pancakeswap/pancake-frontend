import { explorerApiClient } from 'state/info/api/client'
import type { components } from 'state/info/api/schema'
import { transformTransaction } from 'views/V3Info/utils'
import { Transaction } from '../../types'

export async function fetchTokenTransactions(
  address: string,
  chainName: components['schemas']['ChainName'],
  signal: AbortSignal,
): Promise<{ data: Transaction[] | undefined; error: boolean; loading: boolean }> {
  try {
    const data = await explorerApiClient
      .GET('/cached/tx/v3/{chainName}/recent', {
        signal,
        params: {
          path: {
            chainName,
          },
          query: {
            token: address,
          },
        },
      })
      .then((res) => res.data)

    return {
      data: data?.map(transformTransaction),
      error: false,
      loading: false,
    }
  } catch {
    return {
      data: undefined,
      error: true,
      loading: false,
    }
  }
}
