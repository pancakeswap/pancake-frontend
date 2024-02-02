import { ClientConfig, Client as CoreClient, createClient as createCoreClient } from '@pancakeswap/awgmi/core'
import { AptosClient } from 'aptos'

export type CreateClientConfig<TProvider extends AptosClient> = ClientConfig<TProvider>

export function createClient<TProvider extends AptosClient>({ ...config }: CreateClientConfig<TProvider>) {
  const client = createCoreClient<TProvider>(config)
  return client
}

export type Client<TProvider extends AptosClient = AptosClient> = CoreClient<TProvider>
