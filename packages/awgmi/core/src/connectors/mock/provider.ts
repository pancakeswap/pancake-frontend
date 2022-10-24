import { AptosAccount, AptosClient, Types } from 'aptos'
import EventEmitter from 'eventemitter3'
import { devnet } from '../../chain'
import { UserRejectedRequestError } from '../../errors'
import { Address } from '../../types'
import { Account, Aptos, SignMessagePayload, SignMessageResponse } from '../types'

export type MockProviderOptions = {
  chainId?: number
  flags?: {
    isAuthorized?: boolean
    failConnect?: boolean
    failSwitchChain?: boolean
    noSwitchChain?: boolean
  }
  account?: AptosAccount
}

const aptosAccountToAccount = (acc: AptosAccount): Account => {
  return {
    address: acc.address().toShortString() as Address,
    publicKey: acc.pubKey().toShortString(),
  }
}

const client = new AptosClient(devnet.nodeUrls.default)

type Events = {
  accountChange(account: Account): void
  networkChange(network: { networkName: string }): void
  disconnect(): void
}

export class MockProvider implements Aptos {
  options: MockProviderOptions
  _account?: AptosAccount

  events = new EventEmitter<Events>()

  constructor(options: MockProviderOptions) {
    this.options = options
  }

  async isConnected(): Promise<boolean> {
    return this.options.flags?.isAuthorized ?? !!this._account
  }

  async network(): Promise<string> {
    return devnet.network
  }

  async signTransaction(transaction: Types.EntryFunctionPayload): Promise<Uint8Array> {
    if (!this._account) throw new UserRejectedRequestError(new Error())
    const txnRequest = await client.generateTransaction(this._account.address(), transaction)
    const signedTxn = await client.signTransaction(this._account, txnRequest)
    return signedTxn
  }

  async signAndSubmitTransaction(
    transaction: Types.EntryFunctionPayload,
  ): ReturnType<AptosClient['submitTransaction']> {
    if (!this._account) throw new UserRejectedRequestError(new Error())

    const rawTxn = await client.generateTransaction(this._account.address(), transaction)

    const bcsTxn = AptosClient.generateBCSSimulation(this._account, rawTxn)

    return client.submitTransaction(bcsTxn)
  }

  async signMessage(message?: SignMessagePayload | undefined): Promise<SignMessageResponse> {
    if (!this._account) {
      throw new UserRejectedRequestError(new Error())
    }

    if (!message) {
      throw new Error('')
    }

    const prefix = 'APTOS'
    const application = 'aptos.dev'

    const chainId = await client.getChainId()

    const fullMessage = [
      prefix,
      message.address ? `address: ${this._account.address}` : '',
      message.application ? `application: ${application}` : '',
      message.chainId ? `chainId: ${chainId}` : '',
      `message: ${message.message}`,
      `nonce: ${message.nonce}`,
    ]
      .filter(Boolean)
      .join('\n')

    return {
      address: this._account.address().toShortString() as Address,
      application,
      chainId,
      fullMessage,
      message: message.message,
      nonce: message.nonce,
      prefix,
      // TODO: implement
      signature: '',
    }
  }

  async connect(): Promise<Account> {
    if (this.options.flags?.failConnect) throw new UserRejectedRequestError(new Error('Failed to connect'))
    this._account = this.options.account
    if (this._account) {
      this.events.emit('accountChange', aptosAccountToAccount(this._account))
    }
    return this.account()
  }

  async account(): Promise<Account> {
    if (!this._account) throw new UserRejectedRequestError(new Error('Failed to get account'))
    return aptosAccountToAccount(this._account)
  }

  async disconnect(): Promise<void> {
    this.events.emit('disconnect')
    this._account = undefined
  }

  onAccountChange(listener: (account: Account) => void): void {
    this.events.addListener('accountChange', listener)
  }

  onNetworkChange(listener: (network: { networkName: string }) => void): void {
    this.events.addListener('networkChange', listener)
  }

  onDisconnect(listener: () => void): void {
    this.events.addListener('disconnect', listener)
  }

  toJSON() {
    return '<MockProvider>'
  }
}
