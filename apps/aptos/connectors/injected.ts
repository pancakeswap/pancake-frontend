import { AptosClient } from 'aptos'

import { BaseConnector } from './base'
import { ConnectorNotFoundError } from './errors'

declare global {
  interface Window {
    aptos?: any
  }
}

export type InjectedConnectorOptions = {
  /** Name of connector */
  name?: string | ((detectedName: string | string[]) => string)
}

export class InjectedConnector extends BaseConnector<AptosClient> {
  readonly id: string

  readonly name: string

  readonly ready = typeof window !== 'undefined' && !!window.aptos

  provider?: Window['aptos']

  constructor(options: InjectedConnectorOptions) {
    super()

    let name = 'Petra'
    const overrideName = options.name
    if (typeof overrideName === 'string') name = overrideName
    this.id = 'injected'
    this.name = name
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()

      return provider.connect()
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

  async signAndSubmitTransaction() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signAndSubmitTransaction()
  }

  async signTransaction() {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signTransaction()
  }
}
