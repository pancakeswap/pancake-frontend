import { Aptos, HexInput, InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk'

import { Chain } from '../chain'
import { ConnectorNotFoundError } from '../errors'
import { Address } from '../types'
import { Connector } from './base'
import { NetworkInfo, SignMessagePayload, SignMessageResponse } from './types'
import { convertTransactionPayloadToOldFormat } from '../transactions/payloadTransformer'

interface RiseAccount {
  address: Address
  publicKey: HexInput
  authKey: HexInput
  isConnected: boolean
}

type AddressInfo = { address: Address; publicKey: string; authKey?: string }

interface IRiseWallet {
  connect: () => Promise<AddressInfo>
  account(): Promise<RiseAccount>
  isConnected: () => Promise<boolean>
  signAndSubmitTransaction(transaction: any): Promise<{ hash: string }>
  signTransaction(transaction: any, options?: any): Promise<ReturnType<Aptos['transaction']['sign']>>
  signMessage(message: SignMessagePayload): Promise<SignMessageResponse>
  disconnect(): Promise<void>
  network(): Promise<NetworkInfo>
  on(event: string, listener: () => any): void
  off(event: string, listener: () => any): void
  onAccountChange: (listener: (newAddress: AddressInfo) => void) => void
  onNetworkChange: (listener: (network: NetworkInfo) => void) => void
}

declare global {
  interface Window {
    rise?: IRiseWallet
  }
}

export class RiseConnector extends Connector<Window['rise'], any> {
  readonly id = 'rise'

  readonly name = 'Rise Wallet'
  readonly ready = typeof window !== 'undefined' && !!window.rise
  provider?: IRiseWallet

  constructor(config: { chains?: Chain[] } = {}) {
    super(config)
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.rise) this.provider = window.rise
    return this.provider
  }

  async connect() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      if (provider.onAccountChange) provider.onAccountChange(this.onAccountsChanged)
      if (provider.onNetworkChange) provider.onNetworkChange(this.onNetworkChanged)
      if (provider.on) {
        provider.on('disconnect', this.onDisconnect)
      }

      const account = await provider.connect()
      const network = await this.network()

      this.emit('message', { type: 'connecting' })
      return {
        account: {
          address: account.address,
          publicKey: account.publicKey,
        },
        network,
        provider,
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async disconnect() {
    const provider = await this.getProvider()
    if (!provider) return
    // eslint-disable-next-line consistent-return
    return provider.disconnect()
  }

  async account() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const account = await provider.account()
    return {
      address: account.address,
      pubicKey: account.publicKey,
    }
  }

  async network() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const networkName = (await provider.network()).name
    if (!networkName) throw new Error('Network not found')
    return networkName
  }

  async isConnected() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      return provider.isConnected()
    } catch {
      return false
    }
  }

  async signAndSubmitTransaction(tx: InputGenerateTransactionPayloadData) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signAndSubmitTransaction(convertTransactionPayloadToOldFormat(tx))
  }

  async signTransaction(tx: InputGenerateTransactionPayloadData) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signTransaction(convertTransactionPayloadToOldFormat(tx))
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const response = await provider.signMessage(message)

    return response
  }

  protected onAccountsChanged = (account: AddressInfo) => {
    if (!account.address) {
      this.emit('disconnect')
    } else {
      this.emit('change', {
        account,
      })
    }
  }

  protected onNetworkChanged = (network: NetworkInfo) => {
    this.emit('change', { network: network.name })
  }
  protected onDisconnect = () => {
    this.emit('disconnect')
  }
}
