import { Account, Connector, Network } from './base'
import { ConnectorNotFoundError } from '../errors'
import { Aptos, TransactionPayload } from './types'

declare global {
  interface Window {
    aptos?: Aptos
  }
}

enum NetworkName {
  Devnet = 'Devnet',
  Testnet = 'Testnet',
  AIT3 = 'AIT3',
}

export type PetraConnectorOptions = {
  /** Name of connector */
  name?: string | ((detectedName: string | string[]) => string)
}

export class PetraConnector extends Connector {
  readonly id: string

  readonly name: string

  readonly ready = typeof window !== 'undefined' && !!window.aptos

  provider?: Window['aptos']

  constructor(options?: PetraConnectorOptions) {
    super()

    let name = 'Petra'
    const overrideName = options?.name
    if (typeof overrideName === 'string') name = overrideName
    this.id = 'petra'
    this.name = name
  }

  async connect() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      if (provider.on) {
        provider.on('accountChanged', this.onAccountsChanged)
        provider.on('networkChanged', this.onNetworkChanged)
        // provider.on('disconnect', this.onDisconnect)
      }

      this.emit('message', { type: 'connecting' })

      return await provider.connect()
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
    return provider.account()
  }

  async network() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return (await provider.network()).networkName
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.aptos) this.provider = window.aptos
    return this.provider
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

  async signAndSubmitTransaction(tx: TransactionPayload) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signAndSubmitTransaction(tx)
  }

  async signTransaction(tx: TransactionPayload) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signTransaction(tx)
  }

  protected onAccountsChanged = (account: Account) => {
    this.emit('change', { account })
  }

  protected onNetworkChanged = (network: Network) => {
    // const id = normalizeChainId(chainId)
    // const unsupported = this.isChainUnsupported(id)
    this.emit('change', { network })
  }
}
