import { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk'

import { Chain } from '../../chain'
import { Connector, ConnectorData } from '../base'
import { Account, SignMessagePayload, SignMessageResponse } from '../types'
import { MockProvider, MockProviderOptions } from './provider'

export class MockConnector extends Connector {
  readonly id = 'mock'
  readonly name = 'Mock'
  readonly ready = true

  provider?: MockProvider
  options: MockProviderOptions

  // eslint-disable-next-line no-useless-constructor
  constructor(config: { chains?: Chain[]; options: MockProviderOptions }) {
    super(config)
    this.options = config.options
  }

  async connect() {
    const provider = await this.getProvider()

    if (provider.onAccountChange) provider.onAccountChange(this.onAccountsChanged)
    if (provider.onNetworkChange) provider.onNetworkChange(({ networkName }) => this.onNetworkChanged(networkName))
    if (provider.onDisconnect) provider.onDisconnect(this.onDisconnect)

    this.emit('message', { type: 'connecting' })

    const account = await provider?.connect()
    const network = await provider?.network()
    const data: Required<ConnectorData> = {
      account: {
        address: account!.address,
        publicKey: account?.publicKey,
      },
      provider,
      network: network!,
    }

    return new Promise<Required<ConnectorData>>((res) => setTimeout(() => res(data), 100))
  }

  async disconnect() {
    const provider = await this.getProvider()
    await provider.disconnect()
  }

  async network(): Promise<string> {
    const provider = await this.getProvider()
    return provider.network()
  }

  async isConnected(): Promise<boolean> {
    const provider = await this.getProvider()
    return provider?.isConnected()
  }

  async account() {
    const provider = await this.getProvider()
    return provider.account()
  }

  async getProvider() {
    if (!this.provider) this.provider = new MockProvider(this.options)
    return this.provider
  }

  async signAndSubmitTransaction(transaction?: InputGenerateTransactionPayloadData) {
    const provider = await this.getProvider()
    if (!transaction) throw new Error('missing transaction')
    return provider?.signAndSubmitTransaction(transaction)
  }

  async signTransaction(transaction?: InputGenerateTransactionPayloadData) {
    const provider = await this.getProvider()
    if (!transaction) throw new Error('missing transaction')
    return provider?.signTransaction(transaction)
  }

  async signMessage(payload: SignMessagePayload): Promise<SignMessageResponse> {
    const provider = await this.getProvider()
    return provider?.signMessage(payload)
  }

  public isChainUnsupported(_networkName: string): boolean {
    return false
  }

  protected onAccountsChanged = (account?: Account) => {
    this.emit('change', { account })
  }

  protected onNetworkChanged = (network?: string) => {
    this.emit('change', { network })
  }
  protected onDisconnect = () => {
    this.emit('disconnect')
  }

  toJSON() {
    return '<MockConnector>'
  }
}
