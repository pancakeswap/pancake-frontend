import { EntryFunctionPayload } from 'aptos/dist/generated'
import { Chain } from '../chain'
import { ConnectorNotFoundError } from '../errors'
import { Account, Connector, Network } from './base'
import { Aptos } from './types'

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
      if (provider.onAccountChange) {
        provider.onAccountChange(this.onAccountsChanged)
        // TODO: disconnect event??
        // provider.on('disconnect', this.onDisconnect)
      }
      if (provider.onNetworkChange) {
        provider.onNetworkChange(this.onNetworkChanged)
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

  async signAndSubmitTransaction(tx: EntryFunctionPayload) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signAndSubmitTransaction(tx)
  }

  async signTransaction(tx: EntryFunctionPayload) {
    const provider = await this.getProvider()
    if (!provider) throw new ConnectorNotFoundError()
    return provider.signTransaction(tx)
  }

  protected onAccountsChanged = (account: Account) => {
    this.emit('change', { account })
  }

  protected onNetworkChanged = (network: Network) => {
    this.emit('change', { network })
  }
}
