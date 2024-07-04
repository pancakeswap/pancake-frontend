import { Aptos, AptosConfig } from '@aptos-labs/ts-sdk'
import { defaultChains, defaultChain } from './chain'
import { getClient } from './client'

export type GetProviderArgs = {
  /** Network Name to use for provider */
  networkName?: string
}

export type GetProviderResult<TProvider extends Aptos = Aptos> = TProvider

export function getProvider<TProvider extends Aptos = Aptos>({
  networkName,
}: GetProviderArgs = {}): GetProviderResult<TProvider> {
  const client = getClient<TProvider>()
  if (networkName && typeof client.config.provider === 'function') return client.config.provider({ networkName })
  return client.provider
}

export type WatchProviderCallback<TProvider extends Aptos = Aptos> = (provider: GetProviderResult<TProvider>) => void

export function watchProvider<TProvider extends Aptos = Aptos>(
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
      return new Aptos(new AptosConfig({ fullnode: foundChain.nodeUrls.default }))
    }
  }
  return new Aptos(new AptosConfig({ fullnode: defaultChain.nodeUrls.default }))
}
