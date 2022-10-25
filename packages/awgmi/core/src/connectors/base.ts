// dApps can make requests to the wallet from their website:
// - `connect()`: prompts the user to allow connection from the dApp (*neccessary to make other requests*)
// - `isConnected()`: returns if the dApp has established a connection with the wallet
// - `account()`: gets the address of the account signed into the wallet
// - `signAndSubmitTransaction(transaction)`: signs the given transaction and submits to chain
// - `signTransaction(transaction)`: signs the given transaction and returns it to be submitted by the dApp
// - `disconnect()`: Removes connection between dApp and wallet. Useful when the user wants to remove the connection.

import { equalsIgnoreCase } from '@pancakeswap/utils/equalsIgnoreCase'
import { Types } from 'aptos'
import EventEmitter from 'eventemitter3'
import { Chain, defaultChains } from '../chain'
import { Account, SignMessagePayload, SignMessageResponse } from './types'

export type ConnectorData<Provider = any> = {
  account?: Account
  network?: string
  provider?: Provider
}

export interface ConnectorEvents<Provider = any> {
  change(data: ConnectorData<Provider>): void
  connect(): void
  message({ type, data }: { type: string; data?: unknown }): void
  disconnect(): void
  error(error: Error): void
}

export interface ConnectorTransactionResponse {
  hash: string
}

export abstract class Connector<Provider = any, Options = any> extends EventEmitter<ConnectorEvents<Provider>> {
  readonly chains: Chain[]

  constructor({ chains = defaultChains, options }: { chains?: Chain[]; options?: Options }) {
    super()
    this.chains = chains
    this.options = options
  }

  abstract id: string
  abstract name: string
  readonly options?: Options

  abstract readonly ready: boolean

  abstract connect(config?: { networkName?: string }): Promise<Required<ConnectorData>>

  abstract disconnect(): Promise<void>

  abstract account(): Promise<Account>
  abstract network(): Promise<string>
  abstract getProvider(config?: { networkName?: string }): Promise<Provider>

  abstract signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: Partial<Types.SubmitTransactionRequest>,
  ): Promise<ConnectorTransactionResponse>

  abstract signTransaction(transaction: Types.TransactionPayload): Promise<Uint8Array>

  abstract isConnected(): Promise<boolean>
  abstract signMessage(payload: SignMessagePayload): Promise<SignMessageResponse>

  isChainUnsupported(networkName: string) {
    return !this.chains.some((x) => equalsIgnoreCase(x.name, networkName))
  }
}
