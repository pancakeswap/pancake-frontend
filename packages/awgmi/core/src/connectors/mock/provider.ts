import {
  Account as AptosAccount,
  AptosConfig,
  Aptos as AptosSDK,
  InputGenerateTransactionPayloadData,
} from '@aptos-labs/ts-sdk'
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
    address: acc.accountAddress.toString() as Address,
    publicKey: acc.publicKey.toString(),
  }
}

const client = new AptosSDK(new AptosConfig({ fullnode: devnet.nodeUrls.default }))

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

  async signTransaction(
    transaction: InputGenerateTransactionPayloadData,
  ): Promise<ReturnType<AptosSDK['transaction']['sign']>> {
    if (!this._account) throw new UserRejectedRequestError(new Error())
    const txnRequest = await client.transaction.build.simple({
      sender: this._account.accountAddress,
      data: transaction,
    })
    return client.transaction.sign({
      signer: this._account,
      transaction: txnRequest,
    })
  }

  async signAndSubmitTransaction(
    transaction: InputGenerateTransactionPayloadData,
  ): ReturnType<AptosSDK['signAndSubmitTransaction']> {
    if (!this._account) throw new UserRejectedRequestError(new Error())

    const rawTxn = await client.transaction.build.simple({
      sender: this._account.accountAddress,
      data: transaction,
    })

    return client.transaction.signAndSubmitTransaction({
      signer: this._account,
      transaction: rawTxn,
    })
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
      message.address ? `address: ${this._account.accountAddress}` : '',
      message.application ? `application: ${application}` : '',
      message.chainId ? `chainId: ${chainId}` : '',
      `message: ${message.message}`,
      `nonce: ${message.nonce}`,
    ]
      .filter(Boolean)
      .join('\n')

    return {
      address: this._account.accountAddress.toString() as Address,
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
