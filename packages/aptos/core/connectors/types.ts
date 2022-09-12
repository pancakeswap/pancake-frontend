import { AptosClient } from 'aptos'

export type Account = {
  address: string
  publicKey: string
}

export type Network = {
  networkName: string
}

export type TransactionPayload = Parameters<AptosClient['generateTransaction']>[1]

export interface Aptos {
  account(): Promise<Account>
  connect(): Promise<Account>
  disconnect(): Promise<void>

  isConnected(): Promise<boolean>
  network(): Promise<Network>
  signAndSubmitTransaction(transaction: TransactionPayload): ReturnType<AptosClient['submitTransaction']>
  signMessage(message?: unknown): Promise<unknown>
  signTransaction(transaction: TransactionPayload): ReturnType<AptosClient['signTransaction']>
  on?: any
  onAccountChange?: (account?: unknown) => unknown
  onNetworkChange?: (network?: unknown) => unknown
}
