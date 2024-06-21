// eslint-disable-next-line import/extensions
import { GetProviderArgs, getProvider, watchProvider } from '@pancakeswap/awgmi/core'
import { Aptos } from '@aptos-labs/ts-sdk'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector.js'

export type UseProviderArgs = Partial<GetProviderArgs>

export function useProvider<TProvider extends Aptos = Aptos>({ networkName }: UseProviderArgs = {}) {
  return useSyncExternalStoreWithSelector(
    (cb) => watchProvider<TProvider>({ networkName }, cb),
    () => getProvider<TProvider>({ networkName }),
    () => getProvider<TProvider>({ networkName }),
    (x) => x,
    (a, b) => a.config.fullnode === b.config.fullnode,
  )
}
