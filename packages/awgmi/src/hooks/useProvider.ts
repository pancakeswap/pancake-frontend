// eslint-disable-next-line import/extensions
import { GetProviderArgs, getProvider, watchProvider } from '@pancakeswap/awgmi/core'
import { AptosClient } from 'aptos'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector.js'

export type UseProviderArgs = Partial<GetProviderArgs>

export function useProvider<TProvider extends AptosClient = AptosClient>({ networkName }: UseProviderArgs = {}) {
  return useSyncExternalStoreWithSelector(
    (cb) => watchProvider<TProvider>({ networkName }, cb),
    () => getProvider<TProvider>({ networkName }),
    () => getProvider<TProvider>({ networkName }),
    (x) => x,
    (a, b) => a.nodeUrl === b.nodeUrl,
  )
}
