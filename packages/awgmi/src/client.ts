import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { Persister, persistQueryClient } from '@tanstack/react-query-persist-client'
import { AptosClient } from 'aptos'
import { ClientConfig, createClient as createCoreClient, Client as CoreClient } from '@pancakeswap/awgmi/core'
import { deserialize, serialize } from './utils'

export type CreateClientConfig<TProvider extends AptosClient> = ClientConfig<TProvider> & {
  queryClient?: QueryClient
  persister?: Persister | null
}
export function createClient<TProvider extends AptosClient>({
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1_000 * 60 * 60 * 24, // 24 hours
        networkMode: 'offlineFirst',
        refetchOnWindowFocus: false,
        retry: 0,
      },
      mutations: {
        networkMode: 'offlineFirst',
      },
    },
  }),
  persister = typeof window !== 'undefined'
    ? createSyncStoragePersister({
        key: 'awgmi.cache',
        storage: window.localStorage,
        serialize,
        deserialize,
      })
    : undefined,
  ...config
}: CreateClientConfig<TProvider>) {
  const client = createCoreClient<TProvider>(config)
  if (persister)
    persistQueryClient({
      // @ts-ignore
      queryClient,
      persister,
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => query.cacheTime !== 0,
      },
    })
  return Object.assign(client, { queryClient })
}

export type Client<TProvider extends AptosClient = AptosClient> = CoreClient<TProvider> & {
  queryClient: QueryClient
}
