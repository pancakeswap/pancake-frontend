import { Types } from 'aptos'
import { Chain } from '../chain'
import { ConnectorNotFoundError } from '../errors'
import { Account, Connector } from './base'
import { Aptos } from './types'

declare global {
  interface Window {
    aptos?: Aptos
  }
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

  constructor(chains?: Chain[], options?: PetraConnectorOptions) {
    super({
      chains,
    })

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
      if (provider.onAccountChange) provider.onAccountChange(this.onAccountsChanged)
      if (provider.onNetworkChange) provider.onNetworkChange(this.onNetworkChanged)
      if (provider.onDisconnect) provider.onDisconnect(this.onDisconnect)

      const account = await provider.connect()
      const network = await this.network()

      this.emit('message', { type: 'connecting' })
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

  async signAndSubmitTransaction(tx: Types.EntryFunctionPayload) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signAndSubmitTransaction(tx)
  }

  async signTransaction(tx: Types.EntryFunctionPayload) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signTransaction(tx)
  }

  protected onAccountsChanged = (account: Account) => {
    this.emit('change', { account })
  }

  protected onNetworkChanged = (network: string) => {
    this.emit('change', { network })
  }
  protected onDisconnect = () => {
    this.emit('disconnect')
  }
}
