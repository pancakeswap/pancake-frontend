import { AptosClient, Types } from 'aptos'
import { Address } from '../types'

// https://aptos.dev/guides/building-your-own-wallet/#dapp-api
export interface SignMessagePayload {
  address?: boolean // Should we include the address of the account in the message
  application?: boolean // Should we include the domain of the dapp
  chainId?: boolean // Should we include the current chain id the wallet is connected to
  message: string // The message to be signed and displayed to the user
  nonce: number // A nonce the dapp should generate
}

export interface SignMessageResponse {
  address: Address
  application: string
  chainId: number
  fullMessage: string // The message that was generated to sign
  message: string // The message passed in by the user
  nonce: number
  prefix: 'APTOS' // Should always be APTOS
  signature: string // The signed full message
}

export type Account = {
  address: Address
  publicKey?: string | string[]
}

export interface Aptos {
  account(): Promise<Account>
  connect(): Promise<Account>
  disconnect(): Promise<void>

  isConnected(): Promise<boolean>
  network(): Promise<string>
  signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: Partial<Types.SubmitTransactionRequest>,
  ): ReturnType<AptosClient['submitTransaction']>
  signMessage(message?: SignMessagePayload): Promise<SignMessageResponse>
  signTransaction(transaction: Types.TransactionPayload): ReturnType<AptosClient['signTransaction']>
  on?: any
  onAccountChange?(listener: (account: Account) => void): void
  onNetworkChange?(listener: (network: { networkName: string }) => void): void
  onDisconnect?(listener: () => void): void
}

export enum WalletAdapterNetwork {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
  Devnet = 'devnet',
}

export type NetworkInfo = {
  api?: string
  chainId?: string
  name: WalletAdapterNetwork | undefined
}
