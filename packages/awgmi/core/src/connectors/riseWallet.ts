import { Chain } from '../chain'
import { ConnectorNotFoundError, UserRejectedRequestError } from '../errors'
import { PetraConnector, PetraConnectorOptions } from './petra'

declare global {
  interface Window {
    rise?: any
  }
}

export class RiseWalletConnector extends PetraConnector {
  readonly id: string

  readonly name: string
  readonly ready = typeof window !== 'undefined' && !!window.rise
  provider?: any

  constructor(chains?: Chain[], options?: PetraConnectorOptions) {
    super(chains, options)
    let name = 'Rise Wallet'
    const overrideName = options?.name
    if (typeof overrideName === 'string') name = overrideName
    this.id = 'riseWallet'
    this.name = name
  }

  async getProvider() {
    if (typeof window !== 'undefined' && !!window.rise) this.provider = window.rise
    return this.provider
  }

  async connect() {
    try {
      const provider = await this.getProvider()
      if (!provider) throw new ConnectorNotFoundError()
      if (provider.on) {
        provider.on('onAccountChange', this.onAccountsChanged)
        provider.on('onNetworkChange', this.onNetworkChanged)
        provider.on('onDisconnect', this.onDisconnect)
      }

      const isConnected = await provider.connect()
      if (!isConnected) {
        throw new UserRejectedRequestError(new Error())
      }
      // const network = await this.network() // no network yet?

      this.emit('message', { type: 'connecting' })
      return {
        account: {
          address: provider.address,
        },
        network: 'Devnet',
        provider,
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
