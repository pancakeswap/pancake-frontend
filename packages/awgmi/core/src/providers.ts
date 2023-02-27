import { AptosClient } from 'aptos'
import { defaultChains, defaultChain } from './chain'
import { getClient } from './client'

export type GetProviderArgs = {
  /** Network Name to use for provider */
  networkName?: string
}

export type GetProviderResult<TProvider extends AptosClient = AptosClient> = TProvider

export function getProvider<TProvider extends AptosClient = AptosClient>({
  networkName,
}: GetProviderArgs = {}): GetProviderResult<TProvider> {
  const client = getClient<TProvider>()
  if (networkName && typeof client.config.provider === 'function') return client.config.provider({ networkName })
  return client.provider
}

export type WatchProviderCallback<TProvider extends AptosClient = AptosClient> = (
  provider: GetProviderResult<TProvider>,
) => void

export function watchProvider<TProvider extends AptosClient = AptosClient>(
  args: GetProviderArgs,
  callback: WatchProviderCallback<TProvider>,
) {
  const client = getClient()
  const handleChange = async () => callback(getProvider<TProvider>(args))
  const unsubscribe = client.subscribe(({ provider }) => provider, handleChange)
  return unsubscribe
}

export function getDefaultProviders({ networkName }: { networkName?: string }) {
  if (networkName) {
    const foundChain = defaultChains.find((c) => c.network === networkName.toLowerCase())
    if (foundChain) {
      return new AptosClient(foundChain.nodeUrls.default)
    }
  }
  return new AptosClient(defaultChain.nodeUrls.default)
}
