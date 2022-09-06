import { QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import { AptosClient } from 'aptos'
import { Client } from './client'

export const Context = React.createContext<Client<AptosClient> | undefined>(undefined)

export type AptosConfigProps<TProvider extends AptosClient = AptosClient> = {
  /** React-decorated Client instance */
  client: Client<TProvider>
}
export function AptosConfig<TProvider extends AptosClient>({
  children,
  client,
}: React.PropsWithChildren<AptosConfigProps<TProvider>>) {
  return (
    <Context.Provider value={client as unknown as Client}>
      <QueryClientProvider client={client.queryClient}>{children}</QueryClientProvider>
    </Context.Provider>
  )
}

export function useClient<TProvider extends AptosClient>() {
  const client = React.useContext(Context) as unknown as Client<TProvider>
  if (!client) throw new Error(['`useClient` must be used within `AptosConfig`.\n'].join('\n'))
  return client
}
