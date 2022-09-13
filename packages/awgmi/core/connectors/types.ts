import { AptosClient } from 'aptos'
import { EntryFunctionPayload } from 'aptos/dist/generated'

export type Account = {
  address: string
  publicKey: string
}

export interface Aptos {
  account(): Promise<Account>
  connect(): Promise<Account>
  disconnect(): Promise<void>

  isConnected(): Promise<boolean>
  network(): Promise<string>
  signAndSubmitTransaction(transaction: EntryFunctionPayload): ReturnType<AptosClient['submitTransaction']>
  signMessage(message?: unknown): Promise<unknown>
  signTransaction(transaction: EntryFunctionPayload): ReturnType<AptosClient['signTransaction']>
  on?: any
  onAccountChange?: (account?: unknown) => unknown
  onNetworkChange?: (network?: unknown) => unknown
}
