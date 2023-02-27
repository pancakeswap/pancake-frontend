import { Types } from 'aptos'
import { Chain } from '../chain'
import { ConnectorNotFoundError } from '../errors'
import { Connector } from './base'
import { Aptos, Account, SignMessagePayload, SignMessageResponse } from './types'

declare global {
  interface Window {
    aptos?: Aptos
  }
}

export type PetraConnectorOptions = {
  /** Id of connector */
  id?: string
  /** Name of connector */
  name?: string
}

export class PetraConnector extends Connector<Window['aptos'], PetraConnectorOptions> {
  readonly id: string

  readonly name: string

  readonly ready = typeof window !== 'undefined' && !!window.aptos

  provider?: Window['aptos']

  constructor(config: { chains?: Chain[]; options?: PetraConnectorOptions } = {}) {
    super(config)

    let name = 'Petra'
    const overrideName = config.options?.name
    if (typeof overrideName === 'string') name = overrideName
    this.id = config.options?.id || 'petra'
    this.name = name
  }

  async connect() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      if (provider.onAccountChange) provider.onAccountChange(this.onAccountsChanged)
      if (provider.onNetworkChange) provider.onNetworkChange(this.onNetworkChanged)
      if (provider.onDisconnect) provider.onDisconnect(this.onDisconnect)

      this.emit('message', { type: 'connecting' })

      const account = await provider.connect()
      const network = await this.network()

      return {
        account,
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
    return provider.account()
  }

  async network() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.network()
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

  async signAndSubmitTransaction(tx: Types.TransactionPayload) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signAndSubmitTransaction(tx)
  }

  async signTransaction(tx: Types.TransactionPayload) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signTransaction(tx)
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    const response = await provider.signMessage(message)

    return response
  }

  protected onAccountsChanged = (account: Account) => {
    if (!account.address) {
      this.emit('disconnect')
    } else {
      this.emit('change', { account })
    }
  }

  protected onNetworkChanged = (network: { networkName: string }) => {
    this.emit('change', { network: network.networkName })
  }
  protected onDisconnect = () => {
    this.emit('disconnect')
  }
}
