import { ClientConfig, Client as CoreClient, createClient as createCoreClient } from '@pancakeswap/awgmi/core'
import { Aptos } from '@aptos-labs/ts-sdk'

export type CreateClientConfig<TProvider extends Aptos> = ClientConfig<TProvider>

export function createClient<TProvider extends Aptos>({ ...config }: CreateClientConfig<TProvider>) {
  const client = createCoreClient<TProvider>(config)
  return client
}

export type Client<TProvider extends Aptos = Aptos> = CoreClient<TProvider>
