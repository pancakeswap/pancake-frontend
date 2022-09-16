import { AptosClient, Types } from 'aptos'

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
  signAndSubmitTransaction(transaction: Types.EntryFunctionPayload): ReturnType<AptosClient['submitTransaction']>
  signMessage(message?: unknown): Promise<unknown>
  signTransaction(transaction: Types.EntryFunctionPayload): ReturnType<AptosClient['signTransaction']>
  on?: any
  onAccountChange?: (account?: unknown) => unknown
  onNetworkChange?: (network?: unknown) => unknown
}
