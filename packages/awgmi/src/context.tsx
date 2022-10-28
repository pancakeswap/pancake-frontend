import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import { AptosClient } from 'aptos'
import { Client } from './client'

export const Context = React.createContext<Client<AptosClient> | undefined>(undefined)

export const queryClientContext = React.createContext<QueryClient | undefined>(undefined)

export type AwgmiConfigProps<TProvider extends AptosClient = AptosClient> = {
  /** React-decorated Client instance */
  client: Client<TProvider>
}

export function AwgmiConfig<TProvider extends AptosClient>({
  children,
  client,
}: React.PropsWithChildren<AwgmiConfigProps<TProvider>>) {
  return (
    <Context.Provider value={client as unknown as Client}>
      <QueryClientProvider client={client.queryClient} context={queryClientContext}>
        {children}
      </QueryClientProvider>
    </Context.Provider>
  )
}

export function useClient<TProvider extends AptosClient>() {
  const client = React.useContext(Context) as unknown as Client<TProvider>
  if (!client) throw new Error(['`useClient` must be used within `AwgmiConfig`.\n'].join('\n'))
  return client
}
