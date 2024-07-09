import { Aptos } from '@aptos-labs/ts-sdk'
import * as React from 'react'

import { Client } from './client'

export const Context = React.createContext<Client<Aptos> | undefined>(undefined)

export type AwgmiConfigProps<TProvider extends Aptos = Aptos> = {
  /** React-decorated Client instance */
  client: Client<TProvider>
}

export function AwgmiConfig<TProvider extends Aptos>({
  children,
  client,
}: React.PropsWithChildren<AwgmiConfigProps<TProvider>>) {
  return <Context.Provider value={client as unknown as Client}>{children}</Context.Provider>
}

export function useClient<TProvider extends Aptos>() {
  const client = React.useContext(Context) as unknown as Client<TProvider>
  if (!client) throw new Error(['`useClient` must be used within `AwgmiConfig`.\n'].join('\n'))
  return client
}
